// Corre el pipeline de la app (convex/extraccion.ts, mismos prompts y schemas) sobre dataset.json.
// Las respuestas de cada pregunta llegan de a una, como en la app: extraer y después reagrupar con los temas existentes.
// Solo pasa la pregunta y la transcripción; nunca los valores de referencia.
//
//   set -a; . ./.env; set +a; node evals/sentimiento/pipeline.ts
//   -> evals/sentimiento/resultados/{haiku,opus}/pipeline_crudo.json
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { agruparFrases, extraerFrases } from "../../convex/extraccion.ts";

const aqui = new URL(".", import.meta.url).pathname;
const dataset: { id: string; pregunta_id: string; respuesta: string }[] = JSON.parse(readFileSync(aqui + "dataset.json", "utf8"));
const preguntas: { preguntas: { id: string; texto: string }[] } = JSON.parse(readFileSync(aqui + "preguntas.json", "utf8"));
const CONFIGS = [
  { nombre: "haiku", model: "claude-haiku-5-5", effort: "medium" },
  { nombre: "opus", model: "claude-opus-5-5", effort: "low" }, // lo que corre la app hoy
] as const;
const claude = new Anthropic();

async function correrPregunta(m: (typeof CONFIGS)[number], p: { id: string; texto: string }) {
  const frases: { id: string; respuesta_id: string; texto: string; cita: string; emocion: string; intensidad: number }[] = [];
  let agrupado: Awaited<ReturnType<typeof agruparFrases>> = { temas: [], asignacion: [] };
  for (const it of dataset.filter(d => d.pregunta_id === p.id)) {
    const fs = await extraerFrases(claude, p.texto, it.respuesta, m);
    fs.forEach((f, k) => frases.push({ id: `${it.id}_f${k + 1}`, respuesta_id: it.id, ...f }));
    agrupado = await agruparFrases(claude, p.texto, agrupado.temas.map(t => ({ id: t.id, nombre: t.nombre })),
      frases.map(f => ({ id: f.id, texto: f.texto })), m);
  }
  return { frases, ...agrupado };
}

await Promise.all(CONFIGS.map(async m => {
  const t0 = Date.now();
  const salida = Object.fromEntries(await Promise.all(preguntas.preguntas.map(async p => [p.id, await correrPregunta(m, p)])));
  mkdirSync(`${aqui}resultados/${m.nombre}`, { recursive: true });
  writeFileSync(`${aqui}resultados/${m.nombre}/pipeline_crudo.json`,
    JSON.stringify({ model: m.model, effort: m.effort, preguntas: salida }, null, 2) + "\n");
  console.log(`${m.nombre}: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}));
