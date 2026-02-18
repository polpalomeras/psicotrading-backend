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
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 1️⃣ Buscar conversación existente
    let { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user_id)
      .single();

    // 2️⃣ Si no existe → crearla
    if (!conversation) {
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert([{ user_id }])
        .select()
        .single();

      if (error) throw error;
      conversation = newConv;
    }

    // 3️⃣ Guardar mensaje usuario
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "user",
        content: message
      }
    ]);

    // 4️⃣ Traer historial
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    // 5️⃣ Enviar a OpenAI
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: history
        })
      }
    );

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
