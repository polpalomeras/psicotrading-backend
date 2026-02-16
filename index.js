import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "psicotrading-backend",
    message: "Backend activo 🚀"
  });
});

/* =========================
   ENDPOINT PRINCIPAL
========================= */
app.post("/psicotrading/contexto", (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({
      error: "Falta la pregunta"
    });
  }

  const respuesta = {
    respuesta_voz:
      "Entiendo lo que estás viviendo. Vamos a analizarlo con calma y enfoque psicológico para que tomes decisiones más sólidas.",

    respuesta_texto: {
      resumen: `Análisis psicológico sobre: "${pregunta}"`,
      puntos_clave: [
        "Gestión emocional antes de operar",
        "Respeta tu plan de trading",
        "Evita operar por impulso"
      ]
    }
  };

  res.json(respuesta);
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
