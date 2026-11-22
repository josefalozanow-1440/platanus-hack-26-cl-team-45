// ¿Desde qué respuesta deja de servir reagrupar todo? Toma las 25 respuestas sintéticas de Edo (commit 673330f),
// las pasa por extraer y analizar, y después corre agrupar y normalizar como en la app, entrando de a una respuesta,
// en dos órdenes distintos. En cada paso mide grupos, grupos nuevos y rotación (ítems ya agrupados que cambian de grupo).
//
//   set -a; . ./.env; set +a; node evals/hackaton/convergencia.ts
import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { agruparFrases, analizarRespuesta, extraerFrases, normalizarTemas } from "../../convex/extraccion.ts";

const aqui = new URL(".", import.meta.url).pathname;
const PREGUNTA = "¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?";
const respuestas: { id: number; texto: string }[] = JSON.parse(execSync("git show 673330f:data/respuestas-sinteticas.json", { encoding: "utf8" }));
const claude = new Anthropic({ maxRetries: 8 }); // el proxy de la hackatón limita llamadas concurrentes

// 1. Entrada: frases (extraer) y temas libres (analizar) de cada respuesta, guardadas para no repetirlas.
type Entrada = Record<string, { frases: { id: string; texto: string }[]; temas: { id: string; tema: string; cita: string }[] }>;
const cache = aqui + "salidas/convergencia_entrada.json";
let entrada: Entrada;
if (existsSync(cache)) entrada = JSON.parse(readFileSync(cache, "utf8"));
else {
  const lotes: (typeof respuestas)[] = [];
  for (let i = 0; i < respuestas.length; i += 4) lotes.push(respuestas.slice(i, i + 4));
  const pares: [string, Entrada[string]][] = [];
  for (const lote of lotes) pares.push(...await Promise.all(lote.map(async r => {
    const rid = `e${String(r.id).padStart(2, "0")}`;
    const [fs, a] = await Promise.all([extraerFrases(claude, PREGUNTA, r.texto), analizarRespuesta(claude, PREGUNTA, r.texto)]);
    return [rid, {
      frases: fs.map((f, i) => ({ id: `${rid}_f${i + 1}`, texto: f.texto })),
      temas: a.temas.map((t, i) => ({ id: `${rid}_t${i + 1}`, tema: t.tema, cita: t.cita.slice(0, 160) })),
    }] as [string, Entrada[string]];
  })));
  entrada = Object.fromEntries(pares);
  writeFileSync(cache, JSON.stringify(entrada, null, 2) + "\n");
}
const ids = Object.keys(entrada).sort();
const ORDENES = { original: ids, inverso: [...ids].reverse() };

// 2. Agrupación incremental completa, como la app: con cada respuesta se reagrupa todo lo anterior.
type Paso = { k: number; grupos: number; nuevos: number; rotacion: number; segundos: number };
async function correr(tipo: "agrupar" | "normalizar", orden: string[]) {
  let grupos: { id: string; nombre: string; descripcion?: string }[] = [];
  let antes = new Map<string, string>();
  const pasos: Paso[] = [];
  for (let k = 1; k <= orden.length; k++) {
    const t0 = Date.now();
    const vistos = orden.slice(0, k);
    let asignacion: Map<string, string>;
    if (tipo === "agrupar") {
      const out = await agruparFrases(claude, PREGUNTA, grupos.map(g => ({ id: g.id, nombre: g.nombre })), vistos.flatMap(r => entrada[r].frases));
      grupos = out.temas; asignacion = new Map(out.asignacion.map(a => [a.frase, a.tema]));
    } else {
      const out = await normalizarTemas(claude, PREGUNTA, grupos.map(g => ({ id: g.id, nombre: g.nombre, descripcion: g.descripcion ?? "" })), vistos.flatMap(r => entrada[r].temas));
      grupos = out.topicos; asignacion = new Map(out.asignacion.map(a => [a.tema, a.topico]));
    }
    const idsAntes = new Set(antes.values());
    const previos = [...antes.keys()];
    const rotan = previos.filter(i => asignacion.get(i) !== antes.get(i)).length;
    pasos.push({ k, grupos: grupos.length, nuevos: grupos.filter(g => !idsAntes.has(g.id)).length - (k === 1 ? grupos.length : 0),
      rotacion: previos.length ? rotan / previos.length : 0, segundos: (Date.now() - t0) / 1000 });
    antes = asignacion;
  }
  return pasos;
}

const corridas = Object.fromEntries(await Promise.all(
  (["agrupar", "normalizar"] as const).flatMap(tipo => Object.entries(ORDENES).map(async ([nombre, orden]) =>
    [`${tipo}_${nombre}`, await correr(tipo, orden)] as const)),
));
writeFileSync(aqui + "salidas/convergencia.json", JSON.stringify(corridas, null, 2) + "\n");

const L = ["# Convergencia de las agrupaciones", "",
  `${ids.length} respuestas sintéticas de Edo (commit 673330f, ~200 palabras cada una), pregunta: **${PREGUNTA}**. ` +
  "Agrupar (frases → temas de postura) y normalizar (temas libres → tópicos) con los modelos de la app, reagrupando todo con cada respuesta. " +
  "Grupos nuevos: ids que no existían en el paso anterior. Rotación: % de ítems ya agrupados que cambian de grupo.", "",
  "| k | " + Object.keys(corridas).map(c => `${c}: grupos · nuevos · rotación`).join(" | ") + " |",
  "|---|" + Object.keys(corridas).map(() => "---").join("|") + "|"];
for (let k = 1; k <= ids.length; k++)
  L.push(`| ${k} | ` + Object.values(corridas).map(ps => { const p = ps[k - 1]; return `${p.grupos} · ${p.nuevos} · ${(p.rotacion * 100).toFixed(0)}%`; }).join(" | ") + " |");
writeFileSync(aqui + "CONVERGENCIA.md", L.join("\n") + "\n");
console.log(L.slice(3).join("\n"));
