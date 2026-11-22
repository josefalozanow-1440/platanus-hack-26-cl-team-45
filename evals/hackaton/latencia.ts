// Cronometra una llamada de cada paso con la encuesta completa de la hackatón (15 respuestas), 3 veces en paralelo.
//   set -a; . ./.env; set +a; node evals/hackaton/latencia.ts
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { agruparFrases, normalizarTemas, analizarRespuesta, extraerFrases } from "../../convex/extraccion.ts";
const H = new URL(".", import.meta.url).pathname;
const P = "¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?";
const solo = JSON.parse(readFileSync(H + "salidas/haiku_solo.json", "utf8")).respuestas;
const pipe = JSON.parse(readFileSync(H + "salidas/pipeline.json", "utf8"));
const resp = JSON.parse(readFileSync(H + "respuestas.json", "utf8"));
const temas = Object.keys(solo).sort().flatMap(r => solo[r].temas.map((t: any, k: number) => ({ id: `${r}_t${k + 1}`, tema: t.tema, cita: t.cita.slice(0, 160) })));
const frases = pipe.frases.map((f: any) => ({ id: f.id, texto: f.texto }));
const c = new Anthropic();
const t = async (f: () => Promise<unknown>) => { const t0 = Date.now(); await f(); return (Date.now() - t0) / 1000; };
const largo = resp.find((r: any) => r.id === "h10");
const casos: [string, () => Promise<unknown>][] = [
  ["normalizar Haiku medium (15 resp.)", () => normalizarTemas(c, P, [], temas)],
  ["normalizar Opus low (15 resp.)", () => normalizarTemas(c, P, [], temas, { model: "claude-opus-5-5", effort: "low" })],
  ["agrupar Opus low (15 resp.)", () => agruparFrases(c, P, [], frases)],
  ["analizar Haiku medium (450 palabras)", () => analizarRespuesta(c, P, largo.respuesta)],
  ["extraer Opus low (450 palabras)", () => extraerFrases(c, P, largo.respuesta)],
];
for (const [n, f] of casos) {
  const xs = await Promise.all([t(f), t(f), t(f)]);
  console.log(`${n}: ${xs.map(x => x.toFixed(1)).join(" / ")} s`);
}
