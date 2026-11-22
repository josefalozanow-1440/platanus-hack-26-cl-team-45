// Prompts y schemas del pipeline, sin dependencias de Convex: los usa procesar.ts y también
// evals/sentimiento/pipeline.ts, para que el eval mida exactamente lo que corre la app.
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

export const MODELO = { model: "claude-opus-5-5", effort: "low" } as const;
// Agrupar corre con cada respuesta y define cuándo aparece en el mapa: Haiku low tarda ~8 s con 15 respuestas, Opus low ~16 s.
export const MODELO_AGRUPAR = { model: "claude-haiku-5-5", effort: "low" } as const;
type Modelo = { model: string; effort: "low" | "medium" | "high" | "xhigh" | "max" };

// Closed list shared with web/comun.js (POS/NEG); anything else renders as neutral.
export const EMOCIONES = ["alegria", "entusiasmo", "gratitud", "orgullo", "alivio", "esperanza", "satisfaccion", "confianza",
  "frustracion", "cansancio", "enojo", "rabia", "preocupacion", "decepcion", "tristeza", "miedo", "molestia", "angustia",
  "neutral", "sorpresa", "curiosidad", "duda"] as const;

const Frases = z.object({
  frases: z.array(z.object({
    texto: z.string().describe("Idea clave en una frase corta (máx. 12 palabras), en español neutro"),
    cita: z.string().describe("Cita textual breve de la persona que respalda la idea"),
    emocion: z.enum(EMOCIONES),
    intensidad: z.number().describe("0 a 1"),
    conceptos: z.array(z.string()).describe("1 o 2 conceptos de 1-2 palabras en minúscula, reutilizando los mismos términos entre frases"),
  })),
});

const Temas = z.object({
  temas: z.array(z.object({
    id: z.string().describe("Id corto estable, p. ej. t1. Reutiliza el id de un tema existente si sigue siendo el mismo tema"),
    nombre: z.string().describe("Nombre del tema, máx. 6 palabras, que diga la postura (no solo el tópico)"),
    resumen: z.string().describe("Una oración"),
    x: z.number().describe("-3 a 3; temas parecidos quedan cerca"),
    y: z.number().describe("-3 a 3"),
  })),
  asignacion: z.array(z.object({ frase: z.string().describe("id de la frase"), tema: z.string().describe("id del tema") })),
});

export async function extraerFrases(claude: Anthropic, pregunta: string, texto: string, m: Modelo = MODELO) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 4000,
    output_config: { effort: m.effort, format: zodOutputFormat(Frases) },
    system: "Analizas respuestas habladas (transcritas por voz, pueden tener errores) a una encuesta. Extrae de 1 a 5 ideas clave distintas, cada una con su cita textual, emoción e intensidad. No inventes nada que la persona no haya dicho.",
    messages: [{ role: "user", content: `Pregunta: ${pregunta}\n\nRespuesta transcrita:\n${texto}` }],
  });
  const out = r.parsed_output;
  if (!out || !out.frases.length) throw new Error(`sin frases (stop_reason=${r.stop_reason})`);
  return out.frases.slice(0, 5);
}

export async function agruparFrases(
  claude: Anthropic, pregunta: string, temas: { id: string; nombre: string }[], frases: { id: string; texto: string }[], m: Modelo = MODELO_AGRUPAR,
) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 16000,
    output_config: { effort: m.effort, format: zodOutputFormat(Temas) },
    system: "Agrupas frases de una encuesta en temas (entre 2 y 8, según cuántas frases haya). Cada frase va a exactamente un tema. Mantén estables los temas existentes: reutiliza su id y nombre salvo que ya no calcen.",
    messages: [{ role: "user", content: JSON.stringify({ pregunta, temas_existentes: temas, frases }) }],
  });
  const out = r.parsed_output;
  if (!out) throw new Error(`agrupar sin salida (stop_reason=${r.stop_reason})`);
  return out;
}

// ---------- análisis por respuesta y tópicos (corre al lado de extraer/agrupar, no los reemplaza) ----------
// Medido en evals/: Haiku leyendo la respuesta completa con temas libres saca 90% de celdas completas
// contra 65% del pipeline de frases, por ~0,06 ¢ por respuesta. Ver evals/README.md.

export const MODELO_ANALISIS = { model: "claude-haiku-5-5", effort: "medium" } as const;
// Haiku low normaliza en ~8 s con 15 respuestas (medium tarda ~30 s) y respeta igual el rango de tópicos. Ver evals/hackaton/latencia.ts.
export const MODELO_TOPICOS = { model: "claude-haiku-5-5", effort: "low" } as const;

const Analisis = z.object({
  temas: z.array(z.object({
    tema: z.string().describe("Nombre corto del tema, 1 a 4 palabras, en minúscula"),
    direccion: z.enum(["positivo", "negativo", "neutro", "mixto"]).describe("Lo que opina hoy. mixto: dice cosas buenas y malas del mismo tema"),
    intensidad: z.enum(["leve", "moderada", "fuerte"]).nullable().describe("Solo si es positivo o negativo; si no, null"),
    tendencia: z.enum(["mejora", "igual", "empeora", "no_dice"]).describe("no_dice salvo que la persona diga que el tema cambió"),
    cita: z.string().describe("Cita textual breve que lo respalda"),
  })),
  emocion: z.enum(EMOCIONES).describe("Emoción que domina en la respuesta"),
  propone: z.string().nullable().describe("La mejora concreta que propone, o null si no propone ninguna"),
});

export async function analizarRespuesta(claude: Anthropic, pregunta: string, texto: string, m: Modelo = MODELO_ANALISIS) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 4000,
    output_config: { effort: m.effort, format: zodOutputFormat(Analisis) },
    system: "Analizas respuestas habladas (transcritas por voz, pueden tener errores) a una encuesta. Identifica cada tema del que habla la persona y qué opina de él. Usa temas propios de lo que dice, no una lista genérica. No inventes nada que la persona no haya dicho. La dirección es lo que opina hoy: si compara con antes, eso va en la tendencia. Lo que cuenta en broma o riéndose no es una queja. Si usa ironía, interpreta lo que quiere decir y no lo literal.",
    messages: [{ role: "user", content: `Pregunta: ${pregunta}\n\nRespuesta transcrita:\n${texto}` }],
  });
  if (!r.parsed_output) throw new Error(`analizar sin salida (stop_reason=${r.stop_reason})`);
  return r.parsed_output;
}

const Topicos = z.object({
  topicos: z.array(z.object({
    id: z.string().describe("Id corto estable, p. ej. k1. Reutiliza el id de un tópico existente si sigue siendo el mismo"),
    nombre: z.string().describe("De qué se habla, 1 a 4 palabras, sin valoración (no 'comida mala' sino 'comida')"),
    descripcion: z.string().describe("Una oración: qué entra en este tópico"),
  })),
  asignacion: z.array(z.object({ tema: z.string().describe("id del tema"), topico: z.string().describe("id del tópico") })),
});

// shortcut: one LLM call regroups every tema of the poll, like agrupar; fine up to a few hundred temas, switch to embeddings + clustering beyond that.
export async function normalizarTemas(
  claude: Anthropic, pregunta: string, topicos: { id: string; nombre: string; descripcion: string }[],
  temas: { id: string; tema: string; cita: string }[], m: Modelo = MODELO_TOPICOS,
) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 16000,
    output_config: { effort: m.effort, format: zodOutputFormat(Topicos) },
    system: "Agrupas en tópicos los temas que mencionaron las personas al responder una encuesta. Un tópico es de qué se habla, no qué se opina: posturas opuestas sobre lo mismo van al mismo tópico. Cada tema va a exactamente un tópico. " +
      "Con muchas respuestas apunta a entre 12 y 18 tópicos; con pocas, menos. Antes de crear un tópico nuevo revisa si alguno existente responde la misma pregunta. Separa problemas que se arreglan de forma distinta o que arregla otra persona, aunque ocurran en el mismo lugar. Cada tema va al tópico de lo que trata, no al de su consecuencia. Un tópico de una sola persona solo vale si es algo concreto y distinto del resto. Las valoraciones globales van a un tópico de valoración general, sin mezclar ahí temas específicos. " +
      "Mantén estables los tópicos existentes: reutiliza su id y nombre salvo que ya no calcen.",
    messages: [{ role: "user", content: JSON.stringify({ pregunta, topicos_existentes: topicos, temas }) }],
  });
  if (!r.parsed_output) throw new Error(`normalizar sin salida (stop_reason=${r.stop_reason})`);
  return r.parsed_output;
}

// ---------- después de converger: solo asignar lo nuevo (umbral y por qué en encuestas.ts) ----------

const NUEVO = "Solo si un ítem no calza en ninguno de verdad, crea un grupo nuevo para él (con un id que empiece con 'nuevo'); no cambies ni renombres los existentes.";

const TemasNuevos = z.object({
  nuevos: z.array(z.object({
    id: z.string(), nombre: z.string().describe("Máx. 6 palabras, que diga la postura"), resumen: z.string().describe("Una oración"),
    x: z.number().describe("-3 a 3, cerca de los temas parecidos"), y: z.number().describe("-3 a 3"),
  })).describe("Solo los temas nuevos; casi siempre vacío"),
  asignacion: z.array(z.object({ frase: z.string().describe("id de la frase"), tema: z.string().describe("id del tema") })),
});

export async function asignarFrases(
  claude: Anthropic, pregunta: string, temas: { id: string; nombre: string; resumen: string; x: number; y: number }[],
  frases: { id: string; texto: string }[], m: Modelo = MODELO_AGRUPAR,
) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 4000,
    output_config: { effort: m.effort, format: zodOutputFormat(TemasNuevos) },
    system: `Asignas frases nuevas de una encuesta a los temas que ya existen, por postura. Cada frase va a exactamente un tema. ${NUEVO}`,
    messages: [{ role: "user", content: JSON.stringify({ pregunta, temas, frases }) }],
  });
  if (!r.parsed_output) throw new Error(`asignar frases sin salida (stop_reason=${r.stop_reason})`);
  return r.parsed_output;
}

const TopicosNuevos = z.object({
  nuevos: z.array(z.object({
    id: z.string(), nombre: z.string().describe("De qué se habla, 1 a 4 palabras, sin valoración"), descripcion: z.string().describe("Una oración"),
  })).describe("Solo los tópicos nuevos; casi siempre vacío"),
  asignacion: z.array(z.object({ tema: z.string().describe("id del tema"), topico: z.string().describe("id del tópico") })),
});

export async function asignarTemas(
  claude: Anthropic, pregunta: string, topicos: { id: string; nombre: string; descripcion: string }[],
  temas: { id: string; tema: string; cita: string }[], m: Modelo = MODELO_TOPICOS,
) {
  const r = await claude.messages.parse({
    model: m.model,
    max_tokens: 4000,
    output_config: { effort: m.effort, format: zodOutputFormat(TopicosNuevos) },
    system: `Asignas temas nuevos que mencionaron personas en una encuesta a los tópicos que ya existen. Un tópico es de qué se habla, no qué se opina. Cada tema va a exactamente un tópico. ${NUEVO}`,
    messages: [{ role: "user", content: JSON.stringify({ pregunta, topicos, temas }) }],
  });
  if (!r.parsed_output) throw new Error(`asignar temas sin salida (stop_reason=${r.stop_reason})`);
  return r.parsed_output;
}
