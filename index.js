import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Supabase
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

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CLAVE_API_DE_OPENAI}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres Adrian Cole, experto en psicología del trading. Responde de forma profesional, estratégica y clara."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openaiResponse.json();

    if (!data.choices) {
      console.log("OpenAI error:", data);
      return res.status(400).json({ error: "OpenAI error", details: data });
    }

    const reply = data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    // 6️⃣ Guardar respuesta IA
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "assistant",
        content: assistantReply
      }
    ]);

    res.json({ reply: assistantReply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
