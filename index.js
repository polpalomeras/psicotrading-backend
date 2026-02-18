import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===============================
// SUPABASE
// ===============================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Psicotrading backend activo 🚀" });
});

// ===============================
// CHAT ENDPOINT
// ===============================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLAVE_API_DE_OPENAI}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Eres Adrian Cole, experto en psicología del trading. Responde de forma profesional, estratégica y clara.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await openaiResponse.json();

    if (!data.choices || !data.choices[0]) {
      console.error("OpenAI error:", data);
      return res.status(400).json({
        error: "Error en respuesta de OpenAI",
        details: data,
      });
    }

    const reply = data.choices[0].message.content;

    // (Opcional) Guardar mensaje en Supabase
    await supabase.from("messages").insert([
      {
        role: "assistant",
        content: reply,
      },
    ]);

    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
