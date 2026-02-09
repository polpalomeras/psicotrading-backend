import express from "express";

const app = express();
app.use(express.json());

/**
 * =========================
 * PERFILES / CONTEXTOS BASE
 * =========================
 */

const PUBLIC_PROFILE = {
  tipo: "publico",
  enfoque: "psicotrading_general",
  normas: [
    "No es asesoramiento financiero",
    "Enfoque psicológico y emocional",
    "Gestión del riesgo y disciplina"
  ],
  estilo_respuesta: "claro, empático, educativo"
};

const EMPRESA_BASE = {
  tipo: "empresa",
  nombre: "Empresa Corporativa",
  enfoque: "psicologia_trading_corporativa",
  normas_legales: [
    "No es asesoramiento financiero",
    "No recomendaciones de inversión",
    "Cumplimiento normativo interno"
  ],
  tono_respuesta: "profesional, claro, corporativo"
};

const BROKERS = {
  daxlover: {
    tipo: "broker",
    nombre: "DAX Lover",
    enfoque: "trading_intradia_dax",
    normas: [
      "No es asesoramiento financiero",
      "Respeta las reglas del broker",
      "Disciplina operativa estricta"
    ],
    estilo_respuesta: "directo, profesional, enfocado a resultados"
  }
};

/**
 * =========================
 * FUNCIÓN SELECTOR CONTEXTO
 * =========================
 */
function obtenerContexto({ tipo, entidad }) {
  if (tipo === "publico") return PUBLIC_PROFILE;
  if (tipo === "empresa") return EMPRESA_BASE;
  if (tipo === "broker" && BROKERS[entidad]) return BROKERS[entidad];
  return PUBLIC_PROFILE; // fallback seguro
}

/**
 * =========================
 * HEALTHCHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "psicotrading-backend",
    message: "Backend activo 🚀"
  });
});

/**
 * =========================
 * ENDPOINT CONTEXTO UNIFICADO
 * =========================
 * Este será el endpoint principal
 * para web / app / avatar
 */
app.post("/psicotrading/contexto", (req, res) => {
  const { tipo, entidad, usuario, pregunta } = req.body;

  const contexto = obtenerContexto({ tipo, entidad });

  res.json({
    perfil: tipo,
    entidad: entidad || "general",
    enfoque: contexto.enfoque,
    normas: contexto.normas || contexto.normas_legales,
    estilo: contexto.estilo_respuesta || contexto.tono_respuesta,
    usuario: usuario || "anónimo",
    pregunta,

    // RESPUESTA PARA AVATAR (VOZ)
    respuesta_voz:
      "Entiendo lo que estás viviendo. Vamos a analizarlo con calma y enfoque psicológico para que tomes decisiones más sólidas.",

    // RESPUESTA PARA UI (TEXTO)
    respuesta_texto: {
      resumen: "Análisis psicológico del contexto actual del trader.",
      puntos_clave: [
        "Gestión emocional antes de operar",
        "Disciplina según el marco establecido",
        "Reducción de impulsividad"
      ],
      recursos: [
        {
          tipo: "ejercicio",
          titulo: "Respiración previa a la entrada",
          descripcion: "Ejercicio de 2 minutos antes de ejecutar una operación"
        }
      ]
    }
  });
});

/**
 * =========================
 * SERVER
 * =========================
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
