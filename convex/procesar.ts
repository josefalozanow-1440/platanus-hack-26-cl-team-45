import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const MODEL = "claude-opus-5-5";
// Closed list shared with web/comun.js (POS/NEG); anything else renders as neutral.
const EMOCIONES = ["alegria", "entusiasmo", "gratitud", "orgullo", "alivio", "esperanza", "satisfaccion", "confianza",
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

const claude = () => new Anthropic(); // reads ANTHROPIC_API_KEY (+ ANTHROPIC_BASE_URL for the hack proxy) from the Convex env

export const extraer = internalAction({
  args: { respuestaId: v.id("respuestas") },
  handler: async (ctx, { respuestaId }) => {
    const d = await ctx.runQuery(internal.encuestas.leerRespuesta, { respuestaId });
    if (!d) return;
    try {
      const r = await claude().messages.parse({
        model: MODEL,
        max_tokens: 4000,
        output_config: { effort: "low", format: zodOutputFormat(Frases) },
        system: "Analizas respuestas habladas (transcritas por voz, pueden tener errores) a una encuesta. Extrae de 1 a 5 ideas clave distintas, cada una con su cita textual, emoción e intensidad. No inventes nada que la persona no haya dicho.",
        messages: [{ role: "user", content: `Pregunta: ${d.encuesta.pregunta}\n\nRespuesta transcrita:\n${d.respuesta.texto}` }],
      });
      const out = r.parsed_output;
      if (!out || !out.frases.length) throw new Error(`sin frases (stop_reason=${r.stop_reason})`);
      await ctx.runMutation(internal.encuestas.guardarFrases, { respuestaId, frases: out.frases.slice(0, 5) });
    } catch (e) {
      console.error("extraer", respuestaId, e);
      await ctx.runMutation(internal.encuestas.marcarError, { respuestaId });
    }
  },
});

// shortcut: one LLM call regroups every frase of the poll, fine up to a few hundred frases; switch to embeddings + k-means beyond that.
export const agrupar = internalAction({
  args: { encuestaId: v.id("encuestas"), token: v.number() },
  handler: async (ctx, { encuestaId, token }) => {
    const d = await ctx.runQuery(internal.encuestas.leerParaAgrupar, { encuestaId, token });
    if (!d || !d.frases.length) return;
    const r = await claude().messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "low", format: zodOutputFormat(Temas) },
      system: "Agrupas frases de una encuesta en temas (entre 2 y 8, según cuántas frases haya). Cada frase va a exactamente un tema. Mantén estables los temas existentes: reutiliza su id y nombre salvo que ya no calcen.",
      messages: [{ role: "user", content: JSON.stringify({ pregunta: d.pregunta, temas_existentes: d.temas, frases: d.frases }) }],
    });
    const out = r.parsed_output;
    if (!out) throw new Error(`agrupar sin salida (stop_reason=${r.stop_reason})`);
    await ctx.runMutation(internal.encuestas.guardarTemas, { encuestaId, ...out });
  },
});
