// Mide tokens y costo por respuesta de cada paso, sobre las 15 respuestas de la hackatón.
// Cada paso usa su propio cliente con un fetch que anota el usage de cada llamada.
// Escribe COSTO.md y salidas/costo.json.
//
//   set -a; . ./.env; set +a; node evals/hackaton/costo.ts
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";
import { agruparFrases, extraerFrases, MODELO } from "../../convex/extraccion.ts";
import { haikuSolo, PREGUNTA_HACKATON as PREGUNTA } from "./correr.ts";
import { normalizar } from "./normalizar.ts";

const aqui = new URL(".", import.meta.url).pathname;
const respuestas: { id: string; respuesta: string }[] = JSON.parse(readFileSync(aqui + "respuestas.json", "utf8"));
// US$ por millón de tokens (entrada, salida), sin caché. Haiku: precio hasta 100K tokens de entrada.
const PRECIO: Record<string, [number, number]> = { "claude-opus-5-5": [4, 20], "claude-haiku-5-5": [0.1, 0.5] };

type Uso = { paso: string; k: number; model: string; entrada: number; salida: number };
const usos: Uso[] = [];
let k = 0; // respuesta que se está procesando (1..15)
function cliente(paso: string) {
  return new Anthropic({
    fetch: async (url, init) => {
      const res = await fetch(url, init);
      const u = (await res.clone().json().catch(() => null)) as { model?: string; usage?: { input_tokens: number; output_tokens: number } } | null;
      if (u?.usage) usos.push({ paso, k, model: u.model ?? "?", entrada: u.usage.input_tokens, salida: u.usage.output_tokens });
      return res;
    },
  });
}
const c = { extraer: cliente("extraer"), agrupar: cliente("agrupar"), solo: cliente("haiku_solo"),
  normHaiku: cliente("normalizar_haiku"), normOpus: cliente("normalizar_opus") };

// Mismo orden que la app: las respuestas llegan de a una. Los pasos de cada respuesta corren en paralelo entre sí.
const frases: { id: string; texto: string }[] = [];
const temas: { id: string; tema: string; cita: string }[] = [];
let agrupado: Awaited<ReturnType<typeof agruparFrases>> = { temas: [], asignacion: [] };
let topH: { id: string; nombre: string; descripcion: string }[] = [], topO = topH;
for (const r of respuestas) {
  k++;
  const [fs, [, s]] = await Promise.all([extraerFrases(c.extraer, PREGUNTA, r.respuesta), haikuSolo(r, c.solo)]);
  fs.forEach((f, i) => frases.push({ id: `${r.id}_f${i + 1}`, texto: f.texto }));
  s.temas.forEach((t, i) => temas.push({ id: `${r.id}_t${i + 1}`, tema: t.tema, cita: t.cita.slice(0, 160) }));
  const [a, nh, no] = await Promise.all([
    agruparFrases(c.agrupar, PREGUNTA, agrupado.temas.map(t => ({ id: t.id, nombre: t.nombre })), frases),
    normalizar({ model: "claude-haiku-5-5", effort: "medium" }, topH, temas, c.normHaiku),
    normalizar({ model: "claude-opus-5-5", effort: "low" }, topO, temas, c.normOpus),
  ]);
  agrupado = a; topH = nh.topicos; topO = no.topicos;
  console.log(`respuesta ${k}/${respuestas.length}`);
}
writeFileSync(aqui + "salidas/costo.json", JSON.stringify(usos, null, 2) + "\n");

const usd = (u: Uso) => (u.entrada * PRECIO[u.model][0] + u.salida * PRECIO[u.model][1]) / 1e6;
const fmt = (x: number) => x < 0.01 ? `${(x * 100).toFixed(3)} ¢` : `US$ ${x.toFixed(4)}`;
const pasos = ["extraer", "agrupar", "haiku_solo", "normalizar_haiku", "normalizar_opus"];
const N = respuestas.length;
const L = ["# Costo por respuesta", "",
  `Medido el 22-11-2026 sobre las ${N} respuestas de \`respuestas.json\` (41 a 450 palabras), con los mismos prompts de la app. ` +
  "Precios de lista sin caché: Opus 5.5 US$ 4 / 20 y Haiku 5.5 US$ 0,10 / 0,50 por millón de tokens de entrada / salida. " +
  "Los tokens de salida incluyen el razonamiento del modelo. La transcripción (Whisper por OpenRouter, ~US$ 0,0002 por minuto según convex/procesar.ts) no está medida acá.", "",
  "| Paso | Modelo | Llamadas | Entrada promedio | Salida promedio | Costo promedio por llamada | Llamada con la 1.ª respuesta | Llamada con la 15.ª | Total 15 respuestas |",
  "|---|---|---|---|---|---|---|---|---|"];
const total: Record<string, number> = {};
for (const p of pasos) {
  const us = usos.filter(u => u.paso === p);
  if (!us.length) continue;
  const t = us.reduce((a, u) => a + usd(u), 0);
  total[p] = t;
  const prom = (f: (u: Uso) => number) => Math.round(us.reduce((a, u) => a + f(u), 0) / us.length);
  const en = (kk: number) => us.filter(u => u.k === kk).reduce((a, u) => a + usd(u), 0);
  L.push(`| ${p} | ${us[0].model} | ${us.length} | ${prom(u => u.entrada)} | ${prom(u => u.salida)} | ${fmt(t / us.length)} | ${fmt(en(1))} | ${fmt(en(N))} | ${fmt(t)} |`);
}
const app = (total.extraer ?? 0) + (total.agrupar ?? 0);
L.push("", "Costo promedio por respuesta en estas 15, sumando todas sus llamadas:", "",
  `- Pipeline de la app hoy (extraer + agrupar, Opus low): **${fmt(app / N)}**.`,
  `- Más Haiku solo guardado en una fila: **${fmt((app + total.haiku_solo) / N)}**.`,
  `- Más Haiku solo y normalizar con Haiku: **${fmt((app + total.haiku_solo + total.normalizar_haiku) / N)}**; con normalizar en Opus low: **${fmt((app + total.haiku_solo + total.normalizar_opus) / N)}**.`,
  "", "Agrupar y normalizar reenvían todas las frases o temas de la encuesta en cada respuesta nueva, así que su llamada crece con N y el costo total de una encuesta crece más rápido que lineal. Extraer y Haiku solo cuestan lo mismo con cualquier N.", "");
writeFileSync(aqui + "COSTO.md", L.join("\n"));
console.log(L.slice(5).join("\n"));
