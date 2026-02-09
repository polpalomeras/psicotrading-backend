import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   CONTEXTOS BASE
========================= */

const PUBLIC_PROFILE = {
  tipo: "publico",
  enfoque: "psicotrading general",
  normas: ["No es asesoramiento financiero"],
  estilo_respuesta: "claro, empático, educativo",
};

const EMPRESA_BASE = {
  tipo: "empresa",
  enfoque: "psicotrading corporativo",
  normas_legales: [
    "No es asesoramiento financiero",
    "Uso interno corporativo",
  ],
  tono_respuesta: "profesional, claro, corporativo",
};

const BROKERS = {
  daxlover: {
    nombre: "DAX Lover",
    enfoque: "trading intradía DAX",
    normas: [
      "Respeta las reglas del broker",
      "No promesas de rentabilidad",
    ],
    estilo_respuesta: "directo, profesional, enfocado a disciplina",
  },
};

/* =========================
   HELPERS
========================= */

function obtenerContexto({ tipo, entidad }) {
  if (tipo === "empresa") return EMPRESA_BASE;
  if (tipo === "broker" && BROKERS[entidad]) return BROKERS[entidad];
  return PUBLIC_PROFILE;
}

function construirPrompt({ contexto, pregunta }) {
  return `
Eres un psicólogo experto en trading.

Contexto:
- Enfoque: ${contexto.enfoque}
- Normativa: ${(contexto.normas || contexto.normas_legales || []).join(", ")}
- Estilo: ${contexto.estilo_respuesta || contexto.tono_respuesta}

Tarea:
1. Genera una respuesta empática y clara (máx 3 frases) para decir en voz.
2. Luego genera contenido estructurado con:
   - resumen
   - puntos_clave (lista)
   - recursos (ejercicios o recomendaciones prácticas)

Pregunta del usuario:
"${pregunta}"

Devuelve el resultado en JSON con:
- respuesta_voz
- respuesta_texto { resumen, puntos_clave, recursos }
`;
}

/* =========================
   ENDPOINT CONTEXTO GPT REAL
========================= */

app.post("/psicotrading/contexto", async (req, res) => {
  try {
    const { tipo, entidad, pregunta } = req.body;
    const contexto = obtenerContexto({ tipo, entidad });

    const prompt = construirPrompt({ contexto, pregunta });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const respuesta = JSON.parse(
      completion.choices[0].message.content
    );

    res.json({
      perfil: tipo,
      entidad: entidad || "general",
      ...respuesta,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando respuesta GPT" });
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
