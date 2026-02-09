import express from "express";

const app = express();
app.use(express.json());

/**
 * =========================
 * PERFILES / CONTEXTOS
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
  enfoque: "psicotrading_corporativo",
  normas_legales: [
    "No es asesoramiento financiero",
    "Cumple normativa interna",
    "Contenido educativo y psicológico"
  ],
  tono_respuesta: "profesional, claro, corporativo"
};

const BROKERS = {
  daxlover: {
    tipo: "broker",
    nombre: "DAX Lover",
    enfoque: "trading intradía DAX",
    normas: [
      "Respeta reglas del broker",
      "Disciplina estricta",
      "Gestión emocional prioritaria"
    ],
    estilo_respuesta: "directo, profesional"
  }
};

/**
 * =========================
 * FUNCION CONTEXTO
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
 * ENDPOINT PUBLICO
 * =========================
 */

app.post("/psicotrading/public", (req, res) => {
  const { pregunta, usuario } = req.body;

  res.json({
    perfil: "publico",
    usuario: usuario || "anónimo",
    pregunta,
    respuesta_voz:
      "Entiendo cómo te sientes. Vamos a trabajar tu psicología de trading con calma y disciplina.",
    respuesta_texto: {
      resumen: "Psicotrading general",
      puntos_clave: [
        "Gestión emocional",
        "Disciplina",
        "Control del riesgo"
      ]
    }
  });
});

/**
 * =========================
 * ENDPOINT CONTEXTO UNIFICADO
 * =========================
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
    respuesta_voz:
      "Vamos a analizar tu situación con enfoque psicológico y control emocional.",
    respuesta_texto: {
      resumen: "Análisis psicológico del contexto",
      puntos_clave: [
        "Autocontrol",
        "Disciplina",
        "Reducción de impulsividad"
      ],
      recursos: [
        {
          tipo: "ejercicio",
          titulo: "Respiración previa a la entrada",
          descripcion: "Respira 2 minutos antes de operar"
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
