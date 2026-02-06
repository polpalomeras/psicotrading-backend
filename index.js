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
/**
 * ===============================
 * PLANTILLA BROKER
 * Psicotrading adaptado a empresa
 * ===============================
 */

const BROKERS = {
  daxlover: {
    nombre: "DAX Lover",
    regulacion: "Broker europeo regulado",
    enfoque: "trading intradía DAX",
    normas: [
      "No es asesoramiento financiero",
      "Respeta las reglas del broker",
      "Gestión del riesgo obligatoria",
      "Disciplina emocional prioritaria"
    ],
    estilo_respuesta: "directo, profesional, enfocado a resultados"
  },

  forexfactory: {
    nombre: "Forex Factory",
    regulacion: "Broker internacional",
    enfoque: "forex y noticias macro",
    normas: [
      "No promesas de rentabilidad",
      "Control emocional ante noticias",
      "Evitar sobreoperar",
      "Gestión de riesgo estricta"
    ],
    estilo_respuesta: "analítico, calmado, educativo"
  }
};

/**
 * Endpoint BROKER
 * El avatar responde adaptado al broker
 */
app.post("/psicotrading/broker", (req, res) => {
  const { broker, pregunta, usuario } = req.body;

  const brokerConfig = BROKERS[broker];

  if (!brokerConfig) {
    return res.status(404).json({
      error: "Broker no reconocido"
    });
  }

  res.json({
    perfil: "broker",
    broker: brokerConfig.nombre,
    enfoque: brokerConfig.enfoque,
    normas: brokerConfig.normas,
    estilo: brokerConfig.estilo_respuesta,
    usuario: usuario || "anónimo",
    pregunta
  });
});
