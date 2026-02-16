import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
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
 * SELECTOR CONTEXTO
 * =========================
 */
function obtenerContexto({ tipo, entidad }) {
  if (tipo === "publico") return PUBLIC_PROFILE;
  if (tipo === "empresa") return EMPRESA_BASE;
  if (tipo === "broker" && BROKERS[entidad]) return BROKERS[entidad];
  return PUBLIC_PROFILE;
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
 * ENDPOINT PRINCIPAL
 * =========================
 */
app.post("/psicotrading/contexto", (req, res) => {
  const { tipo = "publico", entidad, usuario = "anónimo", pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({
      error: "Falta la pregunta"
    });
  }

  const contexto = obtenerContexto({ tipo, entidad });

  const respuestaBase =
    "Entiendo lo que estás viviendo. Vamos a analizarlo con calma y enfoque psicológico para que tomes decisiones más sólidas.";

  res.json({
    perfil: tipo,
    entidad: entidad || "general",
    enfoque: contexto.enfoque,
    normas: contexto.normas || contexto.normas_legales,
    estilo: contexto.estilo_respuesta || contexto.tono_respuesta,
    usuario,
    pregunta,

    respuesta_voz: respuestaBase,

    respuesta_texto: {
      resumen: `Análisis psicológico sobre: "${pregunta}"`,
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
