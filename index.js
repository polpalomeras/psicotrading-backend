import express from "express";

const app = express();
app.use(express.json());

/**
 * ============================
 * PLANTILLA PUBLIC (usuarios individuales)
 * ============================
 * Psicotrading general, sin broker ni empresa
 */

const PUBLIC_PROFILE = {
  tipo: "public",
  enfoque: "psicotrading_general",
  normas: [
    "No es asesoramiento financiero",
    "Enfoque psicológico y emocional",
    "Gestión del riesgo y disciplina",
  ],
  estilo_respuesta: "claro, empático, educativo",
};

/**
 * Endpoint raíz (healthcheck)
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "psicotrading-backend",
    message: "Backend activo 🚀",
    perfil: PUBLIC_PROFILE.tipo,
  });
});

/**
 * Endpoint psicotrading PUBLIC
 * Aquí más adelante conectaremos con el GPT
 */
app.post("/psicotrading/public", (req, res) => {
  const { pregunta, usuario } = req.body;

  res.json({
    perfil: PUBLIC_PROFILE.tipo,
    usuario: usuario || "anonimo",
    pregunta,
    respuesta_simulada:
      "Respuesta de psicotrading general basada en disciplina, gestión emocional y control del riesgo.",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
