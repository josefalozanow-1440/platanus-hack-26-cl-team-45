import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { agruparFrases, extraerFrases } from "./extraccion";

const claude = () => new Anthropic(); // reads ANTHROPIC_API_KEY (+ ANTHROPIC_BASE_URL for the hack proxy) from the Convex env

// Server-side STT through OpenRouter (OPENROUTER_API_KEY in the Convex env), then the usual extraction.
const STT_MODEL = "openai/whisper-large-v3-turbo"; // ~$0.0002/min
export const transcribir = internalAction({
  args: { respuestaId: v.id("respuestas") },
  handler: async (ctx, { respuestaId }) => {
    const d = await ctx.runQuery(internal.encuestas.leerRespuesta, { respuestaId });
    if (!d?.respuesta.audioId) return;
    try {
      const audio = await ctx.storage.get(d.respuesta.audioId);
      if (!audio) throw new Error("audio no encontrado");
      // OpenRouter derives the format from the filename; Safari records mp4 (sent as m4a), Chrome/Firefox webm.
      const ext = audio.type.includes("mp4") ? "m4a" : audio.type.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("file", audio, `respuesta.${ext}`);
      form.append("model", STT_MODEL);
      form.append("language", "es");
      const res = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        body: form,
      });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
      const texto = ((await res.json()).text ?? "").trim();
      if (texto.length < 3) throw new Error("transcripción vacía");
      if (await ctx.runMutation(internal.encuestas.guardarTexto, { respuestaId, texto: texto.slice(0, 6000) }))
        await ctx.scheduler.runAfter(0, internal.procesar.extraer, { respuestaId });
    } catch (e) {
      console.error("transcribir", respuestaId, e);
      await ctx.runMutation(internal.encuestas.marcarError, { respuestaId });
    }
  },
});

export const extraer = internalAction({
  args: { respuestaId: v.id("respuestas") },
  handler: async (ctx, { respuestaId }) => {
    const d = await ctx.runQuery(internal.encuestas.leerRespuesta, { respuestaId });
    if (!d) return;
    try {
      const frases = await extraerFrases(claude(), d.encuesta.pregunta, d.respuesta.texto);
      await ctx.runMutation(internal.encuestas.guardarFrases, { respuestaId, frases });
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
    const out = await agruparFrases(claude(), d.pregunta, d.temas, d.frases);
    await ctx.runMutation(internal.encuestas.guardarTemas, { encuestaId, ...out });
  },
});
