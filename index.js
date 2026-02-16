import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "psicotrading-backend",
    message: "Backend activo 🚀"
  });
});

// 🎯 Endpoint principal
app.post("/psicotrading/contexto", async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({
        error: "Falta la pregunta"
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un psicólogo experto en psicotrading.
Tu enfoque es emocional, disciplinado y profesional.
No das asesoramiento financiero.
Ayudas al trader a gestionar miedo, impulsividad y disciplina.
          `
        },
        {
          role: "user",
          content: pregunta
        }
      ],
      temperature: 0.7
    });

    const respuesta = completion.choices[0].message.content;

    res.json({
      respuesta_voz: respuesta,
      respuesta_texto: respuesta
    });

  } catch (error) {
    console.error("Error OpenAI:", error);
    res.status(500).json({
      error: "Error generando respuesta"
    });
  }
});

// 🚀 Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
