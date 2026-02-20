import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({ status: "Psicotrading backend activo 🚀" });
});

// ===============================
// CHAT → OPENAI
// ===============================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const openaiRes = await fetch(
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
                "Eres Adrian Cole, experto en psicología del trading. Respondes con claridad, calma y autoridad profesional.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

// ===============================
// AVATAR → D-ID
// ===============================
app.post("/avatar", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const didRes = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: {
          type: "text",
          input: text,
          provider: {
            type: "microsoft",
            voice_id: "es-ES-AlvaroNeural",
          },
        },
        source_url:
          "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
      }),
    });

    const data = await didRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "D-ID error" });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
