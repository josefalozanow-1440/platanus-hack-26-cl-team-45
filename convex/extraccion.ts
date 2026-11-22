// Prompts y schemas del pipeline, sin dependencias de Convex: los usa procesar.ts y también
// evals/sentimiento/pipeline.ts, para que el eval mida exactamente lo que corre la app.
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

export const MODELO = { model: "claude-opus-5-5", effort: "low" } as const;
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
  claude: Anthropic, pregunta: string, temas: { id: string; nombre: string }[], frases: { id: string; texto: string }[], m: Modelo = MODELO,
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
