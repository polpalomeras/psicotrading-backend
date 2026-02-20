import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// PORT
// ===============================
const PORT = process.env.PORT || 3000;

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Psicotrading backend activo 🚀" });
});

// ===============================
// CHAT CORE (USADO POR WEB + AVATAR)
// ===============================
async function generarRespuesta(message) {
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Eres Adrian Cole, experto en psicología del trading. Ayudas a traders a controlar emociones, disciplina y mentalidad. Respondes con claridad, autoridad y enfoque práctico.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("Respuesta inválida de OpenAI");
  }

  return data.choices[0].message.content;
}

// ===============================
// CHAT ENDPOINT (WEB)
// ===============================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generarRespuesta(message);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat error" });
  }
});

// ===============================
// CHAT ENDPOINT (AVATAR 24/7)
// LiveAvatar / Webhook ready
// ===============================
app.post("/avatar/chat", async (req, res) => {
  try {
    const message =
      req.body?.message ||
      req.body?.text ||
      req.body?.input ||
      "";

    if (!message) {
      return res.json({ reply: "No he recibido ningún mensaje." });
    }

    const reply = await generarRespuesta(message);

    // Respuesta SIMPLE (ideal para avatar voz)
    res.json({
      reply,
    });
  } catch (error) {
    console.error("Avatar error:", error);
    res.json({
      reply:
        "Ahora mismo no puedo responder, respira y vuelve a intentarlo.",
    });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Psicotrading backend activo en puerto ${PORT}`);
});
