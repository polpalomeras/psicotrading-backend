import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

app.post("/chat", async (req, res) => {
  try {
    const { user_id, message } = req.body;

    // 1️⃣ Buscar conversación existente
    let { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (!conversation) {
      const { data: newConversation } = await supabase
        .from("conversations")
        .insert([{ user_id }])
        .select()
        .single();

      conversation = newConversation;
    }

    // 2️⃣ Guardar mensaje usuario
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "user",
        content: message,
      },
    ]);

    // 3️⃣ Obtener historial
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    const formattedMessages = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4️⃣ Llamar a OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un psicólogo profesional especializado en psicología del trading. Solo hablas de gestión emocional, disciplina, control de riesgo y mentalidad de trader.",
          },
          ...formattedMessages,
        ],
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // 5️⃣ Guardar respuesta IA
    await supabase.from("messages").insert([
      {
        conversation_id: conversation.id,
        role: "assistant",
        content: aiMessage,
      },
    ]);

    res.json({ reply: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en puerto 3000");
});
