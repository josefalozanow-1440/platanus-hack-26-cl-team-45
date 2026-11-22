// Prueba del normalizador: junta los temas libres de Haiku solo (salidas/haiku_solo.json) en tópicos
// por encuesta. Igual que agrupar en la app: entra una respuesta y se reagrupan TODOS los temas libres,
// reutilizando los tópicos existentes. Escribe NORMALIZACION.md para revisar a mano.
//
//   set -a; . ./.env; set +a; node evals/hackaton/normalizar.ts
import Anthropic from "@anthropic-ai/sdk";
import { normalizarTemas } from "../../convex/extraccion.ts";
import { readFileSync, writeFileSync } from "node:fs";

const aqui = new URL(".", import.meta.url).pathname;
const PREGUNTA = "¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?";
type Tema = { tema: string; direccion: string; intensidad: string | null; tendencia: string; cita: string };
const solo: Record<string, { temas: Tema[]; emocion: string; propone: string | null }> =
  JSON.parse(readFileSync(aqui + "salidas/haiku_solo.json", "utf8")).respuestas;
const ids = Object.keys(solo).sort();
const CONFIGS = [
  { nombre: "haiku", model: "claude-haiku-5-5", effort: "low" },
  { nombre: "opus", model: "claude-opus-5-5", effort: "low" },
] as const;
const claude = new Anthropic();

export async function normalizar(m: { model: string; effort: "low" | "medium" }, topicos: { id: string; nombre: string; descripcion: string }[],
  temas: { id: string; tema: string; cita: string }[], c: Anthropic = claude) {
  return normalizarTemas(c, PREGUNTA, topicos, temas, m);
}

function celda(ts: Tema[]) { // varios temas de una persona en el mismo tópico se juntan en una celda
  const ds = new Set(ts.map(t => t.direccion));
  const direccion = ds.has("mixto") || (ds.has("positivo") && ds.has("negativo")) ? "mixto"
    : ds.has("positivo") ? "positivo" : ds.has("negativo") ? "negativo" : "neutro";
  const tend = ts.map(t => t.tendencia).filter(t => t !== "no_dice");
  return { direccion, tendencia: tend[0] ?? "no_dice", temas: ts };
}

if (import.meta.main) {
  const L = ["# Normalización de temas libres en tópicos", "", `Pregunta: **${PREGUNTA}**`, "",
    `Entrada: los temas libres de Haiku medium solo para ${ids.length} respuestas (${Object.values(solo).reduce((a, s) => a + s.temas.length, 0)} temas). ` +
    "Las respuestas entran de a una y con cada una se reagrupan todos los temas, reutilizando los tópicos existentes.", ""];

  for (const m of CONFIGS) {
    const t0 = Date.now();
    let out: Awaited<ReturnType<typeof normalizarTemas>> = { topicos: [], asignacion: [] };
    const historia: number[] = [];
    for (let i = 0; i < ids.length; i++) {
      const temas = ids.slice(0, i + 1).flatMap(rid => solo[rid].temas.map((t, k) => ({ id: `${rid}_t${k + 1}`, tema: t.tema, cita: t.cita.slice(0, 160) })));
      out = await normalizar(m, out.topicos, temas);
      historia.push(out.topicos.length);
    }
    const seg = ((Date.now() - t0) / 1000).toFixed(0);
    writeFileSync(`${aqui}salidas/normalizar_${m.nombre}.json`, JSON.stringify({ model: m.model, effort: m.effort, ...out }, null, 2) + "\n");

    const topicoDe = new Map(out.asignacion.map(a => [a.tema, a.topico]));
    const sinTopico = ids.flatMap(rid => solo[rid].temas.map((t, k) => [`${rid}_t${k + 1}`, t] as const)).filter(([id]) => !topicoDe.has(id));
    const matriz: Record<string, Record<string, ReturnType<typeof celda>>> = {};
    for (const rid of ids) {
      const por: Record<string, Tema[]> = {};
      solo[rid].temas.forEach((t, k) => { const tp = topicoDe.get(`${rid}_t${k + 1}`); if (tp) (por[tp] ??= []).push(t); });
      matriz[rid] = Object.fromEntries(Object.entries(por).map(([tp, ts]) => [tp, celda(ts)]));
    }
    const filas = out.topicos.map(tp => {
      const cs = ids.map(rid => matriz[rid][tp.id]).filter(Boolean);
      return { tp, cs, n: cs.length };
    }).sort((a, b) => b.n - a.n);

    L.push(`## ${m.model}, effort ${m.effort}`, "",
      `${out.topicos.length} tópicos, ${seg} s. Tópicos después de cada respuesta: ${historia.join(", ")}. ` +
      `Temas sin tópico: ${sinTopico.length}${sinTopico.length ? ` (${sinTopico.map(([id, t]) => `${id} «${t.tema}»`).join(", ")})` : ""}.`, "",
      "| Tópico | Personas | + | − | ± | 0 | Mejora | Empeora | Temas libres que cayeron acá |", "|---|---|---|---|---|---|---|---|---|");
    for (const { tp, cs, n } of filas) {
      const c = (d: string) => cs.filter(x => x.direccion === d).length;
      const etiquetas = [...new Set(cs.flatMap(x => x.temas.map(t => t.tema)))].join(" · ");
      L.push(`| **${tp.nombre}** | ${n} | ${c("positivo")} | ${c("negativo")} | ${c("mixto")} | ${c("neutro")} | ` +
        `${cs.filter(x => x.tendencia === "mejora").length} | ${cs.filter(x => x.tendencia === "empeora").length} | ${etiquetas} |`);
    }
    const sim: Record<string, string> = { positivo: "+", negativo: "−", mixto: "±", neutro: "0" };
    L.push("", "Matriz persona × tópico (+ positivo, − negativo, ± mixto, 0 neutro):", "",
      `| | ${filas.map(f => f.tp.nombre).join(" | ")} |`, `|---|${filas.map(() => "---").join("|")}|`,
      ...ids.map(rid => `| ${rid} | ${filas.map(f => sim[matriz[rid][f.tp.id]?.direccion] ?? "").join(" | ")} |`), "");
    console.log(`${m.nombre}: ${out.topicos.length} tópicos en ${seg} s`);
  }
  writeFileSync(aqui + "NORMALIZACION.md", L.join("\n"));
}
