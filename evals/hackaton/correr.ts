// Corre sobre respuestas.json (sin valores esperados) el pipeline de la app y Haiku medium solo, y escribe
// LECTURA.md para comparar a mano qué saca cada uno.
//
//   set -a; . ./.env; set +a; node evals/hackaton/correr.ts
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { agruparFrases, analizarRespuesta, extraerFrases, MODELO, MODELO_AGRUPAR } from "../../convex/extraccion.ts";

const aqui = new URL(".", import.meta.url).pathname;
const PREGUNTA = "¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?";
const respuestas: { id: string; respuesta: string }[] = JSON.parse(readFileSync(aqui + "respuestas.json", "utf8"));
const claude = new Anthropic();

// ---------- pipeline de la app: las respuestas llegan de a una ----------
async function pipeline() {
  const frases: { id: string; respuesta_id: string; texto: string; cita: string; emocion: string; intensidad: number; conceptos: string[] }[] = [];
  let agrupado: Awaited<ReturnType<typeof agruparFrases>> = { temas: [], asignacion: [] };
  for (const r of respuestas) {
    const fs = await extraerFrases(claude, PREGUNTA, r.respuesta);
    fs.forEach((f, k) => frases.push({ id: `${r.id}_f${k + 1}`, respuesta_id: r.id, ...f }));
    agrupado = await agruparFrases(claude, PREGUNTA, agrupado.temas.map(t => ({ id: t.id, nombre: t.nombre })),
      frases.map(f => ({ id: f.id, texto: f.texto })));
  }
  return { model: `extraer ${MODELO.model} ${MODELO.effort}, agrupar ${MODELO_AGRUPAR.model} ${MODELO_AGRUPAR.effort}`, effort: "", frases, ...agrupado };
}

// ---------- Haiku solo: el análisis por respuesta de la app (convex/extraccion.ts) ----------
export const PREGUNTA_HACKATON = PREGUNTA;
export async function haikuSolo(r: { id: string; respuesta: string }, c: Anthropic = claude) {
  return [r.id, await analizarRespuesta(c, PREGUNTA, r.respuesta)] as const;
}

if (import.meta.main) {
  const t0 = Date.now();
  const [pipe, solo] = await Promise.all([pipeline(), Promise.all(respuestas.map(r => haikuSolo(r))).then(Object.fromEntries)]);
  console.log(`listo en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  mkdirSync(aqui + "salidas", { recursive: true });
  writeFileSync(aqui + "salidas/pipeline.json", JSON.stringify(pipe, null, 2) + "\n");
  writeFileSync(aqui + "salidas/haiku_solo.json", JSON.stringify({ model: "claude-haiku-5-5", effort: "medium", respuestas: solo }, null, 2) + "\n");

  // ---------- LECTURA.md ----------
  const temaDe = new Map(pipe.asignacion.map(a => [a.frase, a.tema]));
  const temas = new Map(pipe.temas.map(t => [t.id, t]));
  const L = [
    "# Lectura a mano: percepción de la hackatón", "",
    `Pregunta: **${PREGUNTA}**`, "",
    `${respuestas.length} respuestas escritas por un subagente Opus sin columnas ni valores esperados. ` +
    `Pipeline = el de la app (${pipe.model}, effort ${pipe.effort}), con las respuestas entrando de a una. ` +
    "Haiku solo = claude-haiku-5-5, effort medium, temas libres por respuesta.", "",
    "## Mapa del pipeline", "", "| Tema | Personas | Resumen |", "|---|---|---|",
    ...pipe.temas.map(t => {
      const n = new Set(pipe.frases.filter(f => temaDe.get(f.id) === t.id).map(f => f.respuesta_id)).size;
      return `| ${t.nombre} | ${n} | ${t.resumen} |`;
    }), "",
  ];
  for (const r of respuestas) {
    const s = solo[r.id];
    L.push(`## ${r.id}`, "", ...r.respuesta.split("\n").map(x => `> ${x}`), "", "**Pipeline**", "");
    for (const f of pipe.frases.filter(f => f.respuesta_id === r.id))
      L.push(`- ${f.texto} · ${f.emocion} ${f.intensidad.toFixed(1)} · tema «${temas.get(temaDe.get(f.id) ?? "")?.nombre ?? "sin tema"}» · "${f.cita}"`);
    L.push("", "**Haiku solo**", "");
    for (const t of s.temas)
      L.push(`- ${t.tema}: ${[t.direccion, t.intensidad, t.tendencia !== "no_dice" ? t.tendencia : null].filter(Boolean).join(" · ")} · "${t.cita}"`);
    L.push(`- Emoción: ${s.emocion} · Propone: ${s.propone ?? "nada"}`, "");
  }
  writeFileSync(aqui + "LECTURA.md", L.join("\n"));
}
