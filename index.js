import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend activo 🚀" });
});

app.post("/psicotrading/contexto", async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un psicólogo especializado en psicotrading. Responde con enfoque emocional, disciplina y gestión del riesgo."
        },
        {
          role: "user",
          content: pregunta
        }
      ]
    });

    const respuesta = completion.choices[0].message.content;

    res.json({ respuesta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en OpenAI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
