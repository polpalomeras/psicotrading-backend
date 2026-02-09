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
  perfil: tipo,
  entidad: entidad || "general",
  contexto_psicologico: contexto.enfoque,
  normas: contexto.normas || contexto.normas_legales,
  estilo: contexto.estilo_respuesta || contexto.tono_respuesta,

  respuesta_voz:
    "Entiendo lo que estás viviendo. Vamos a analizarlo con calma y enfoque psicológico para que tomes decisiones más sólidas.",

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
  
/**
 * Endpoint CONTEXTO UNIFICADO
 * Decide si es público, empresa o broker
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
    respuesta_simulada:
      "Respuesta generada según contexto psicológico y normativo seleccionado."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
/**
 * ============================
 * PLANTILLA EMPRESA
 * Marco superior corporativo
 * ============================
 */

const EMPRESA_BASE = {
  tipo: "empresa",
  nombre: "Empresa genérica psicotrading",
  ambito: "trading y mercados financieros",
  rol_avatar: "psicólogo digital corporativo",

  normas_legales: [
    "No es asesoramiento financiero",
    "No se dan señales de trading",
    "No se recomienda invertir capital",
    "Contenido educativo y psicológico"
  ],

  enfoque_psicologico: [
    "gestión emocional",
    "disciplina",
    "control del riesgo",
    "procesos mentales del trader"
  ],

  tono_respuesta: "profesional, claro, calmado, corporativo",

  limites: {
    señales: false,
    recomendacion_activos: false,
    gestion_cuentas: false
  }
};
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
function obtenerContexto({ tipo, entidad }) {
  if (tipo === "publico") return PUBLIC_PROFILE;
  if (tipo === "empresa") return EMPRESA_BASE;
  if (tipo === "broker" && BROKERS[entidad]) return BROKERS[entidad];

  return PUBLIC_PROFILE; // fallback seguro
}
function construirRespuestaC1({ contexto, pregunta, usuario }) {
  return {
    voice: `Gracias ${usuario || "trader"}. Según tu contexto (${contexto.tipo}), esta es mi recomendación.`,
    
    text: [
      "Detecto un patrón emocional relacionado con la disciplina.",
      "Te recomiendo aplicar una pausa estructurada antes de la siguiente operación."
    ],

    actions: [
      "pausa_5_min",
      "registro_emocional"
    ],

    links: [
      {
        titulo: "Ejercicio de disciplina del trader",
        url: "https://ejemplo.com/ejercicio-disciplina"
      }
    ],

    meta: {
      tipo: contexto.tipo,
      entidad: contexto.nombre || null,
      timestamp: new Date().toISOString()
    }
  };
}
