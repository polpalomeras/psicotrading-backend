import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "psicotrading-backend",
    message: "Backend activo 🚀"
  });
});

app.post("/psicotrading/contexto", async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({
      error: "Falta la pregunta"
    });
  }

  res.json({
    respuesta_voz: "Entiendo lo que estás viviendo. Vamos a analizarlo con calma y enfoque psicológico.",
    respuesta_texto: {
      resumen: `Análisis psicológico sobre: "${pregunta}"`,
      puntos_clave: [
        "Gestión emocional",
        "Disciplina operativa",
        "Control de impulsividad"
      ]
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
