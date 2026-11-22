import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Admin gate: one shared key in the Convex env (`npx convex env set ADMIN_KEY ...`). Participants never log in.
function exigirAdmin(clave: string) {
  const k = process.env.ADMIN_KEY;
  if (!k || clave !== k) throw new Error("Clave de admin incorrecta");
}

export const esAdmin = query({
  args: { clave: v.string() },
  handler: async (_ctx, { clave }) => !!process.env.ADMIN_KEY && clave === process.env.ADMIN_KEY,
});

// ---------- admin ----------

export const crear = mutation({
  args: { clave: v.string(), pregunta: v.string() },
  handler: async (ctx, { clave, pregunta }) => {
    exigirAdmin(clave);
    const p = pregunta.trim();
    if (!p) throw new Error("La pregunta está vacía");
    return await ctx.db.insert("encuestas", { pregunta: p.slice(0, 300), abierta: true });
  },
});

export const abrirCerrar = mutation({
  args: { clave: v.string(), encuestaId: v.id("encuestas"), abierta: v.boolean() },
  handler: async (ctx, { clave, encuestaId, abierta }) => {
    exigirAdmin(clave);
    await ctx.db.patch(encuestaId, { abierta });
  },
});

export const borrarRespuesta = mutation({
  args: { clave: v.string(), respuestaId: v.id("respuestas") },
  handler: async (ctx, { clave, respuestaId }) => {
    exigirAdmin(clave);
    const r = await ctx.db.get(respuestaId);
    if (!r) return;
    for (const f of await ctx.db.query("frases").withIndex("by_respuesta", q => q.eq("respuestaId", respuestaId)).collect()) await ctx.db.delete(f._id);
    await ctx.db.delete(respuestaId);
    await pedirAgrupar(ctx, r.encuestaId);
  },
});

export const reprocesar = mutation({
  args: { clave: v.string(), respuestaId: v.id("respuestas") },
  handler: async (ctx, { clave, respuestaId }) => {
    exigirAdmin(clave);
    await ctx.db.patch(respuestaId, { estado: "procesando" });
    await ctx.scheduler.runAfter(0, internal.procesar.extraer, { respuestaId });
  },
});

export const listar = query({
  args: {},
  handler: async ctx => {
    const es = await ctx.db.query("encuestas").order("desc").collect();
    return Promise.all(es.map(async e => {
      const rs = await ctx.db.query("respuestas").withIndex("by_encuesta", q => q.eq("encuestaId", e._id)).collect();
      return { ...e, respuestas: rs.length, personas: new Set(rs.map(r => r.participante)).size };
    }));
  },
});

export const respuestas = query({
  args: { encuestaId: v.id("encuestas") },
  handler: async (ctx, { encuestaId }) =>
    ctx.db.query("respuestas").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).order("desc").collect(),
});

// ---------- participants (anonymous) ----------

// The poll to answer: the one in the link, else the newest open one.
export const actual = query({
  args: { encuestaId: v.optional(v.id("encuestas")) },
  handler: async (ctx, { encuestaId }) => {
    if (encuestaId) return await ctx.db.get(encuestaId);
    return (await ctx.db.query("encuestas").order("desc").collect()).find(e => e.abierta) ?? null;
  },
});

export const responder = mutation({
  args: { encuestaId: v.id("encuestas"), participante: v.string(), texto: v.string() },
  handler: async (ctx, { encuestaId, participante, texto }) => {
    const e = await ctx.db.get(encuestaId);
    if (!e || !e.abierta) throw new Error("La encuesta está cerrada");
    const t = texto.trim();
    if (t.length < 3) throw new Error("La respuesta está vacía");
    if (t.length > 6000 || participante.length > 64) throw new Error("La respuesta es demasiado larga");
    const respuestaId = await ctx.db.insert("respuestas", { encuestaId, participante, texto: t, estado: "procesando" });
    await ctx.scheduler.runAfter(0, internal.procesar.extraer, { respuestaId });
    return respuestaId;
  },
});

export const mias = query({
  args: { encuestaId: v.id("encuestas"), participante: v.string() },
  handler: async (ctx, { encuestaId, participante }) =>
    (await ctx.db.query("respuestas").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).collect())
      .filter(r => r.participante === participante),
});

// ---------- live map: same shape the panels used to poll from /api/mapa ----------

export const mapa = query({
  args: { encuestaId: v.optional(v.id("encuestas")) },
  handler: async (ctx, { encuestaId }) => {
    const e = encuestaId ? await ctx.db.get(encuestaId) : (await ctx.db.query("encuestas").order("desc").first());
    if (!e) return null;
    const rs = await ctx.db.query("respuestas").withIndex("by_encuesta", q => q.eq("encuestaId", e._id)).collect();
    const fs = await ctx.db.query("frases").withIndex("by_encuesta", q => q.eq("encuestaId", e._id)).collect();
    const ts = await ctx.db.query("temas").withIndex("by_encuesta", q => q.eq("encuestaId", e._id)).collect();
    const orden = new Map(rs.map((r, i) => [r._id as string, i]));
    const quien = new Map(rs.map(r => [r._id as string, r.participante]));
    const agrupadas = fs.filter(f => f.temaId && orden.has(f.respuestaId))
      .sort((a, b) => orden.get(a.respuestaId)! - orden.get(b.respuestaId)!);
    return {
      encuestaId: e._id,
      pregunta: e.pregunta,
      abierta: e.abierta,
      total_participantes: new Set(rs.map(r => r.participante)).size,
      clusters: ts.map(t => {
        const mias = agrupadas.filter(f => f.temaId === t.tid);
        return { id: t.tid, nombre: t.nombre, resumen: t.resumen, x: t.x, y: t.y, n: new Set(mias.map(f => quien.get(f.respuestaId))).size };
      }).filter(c => c.n > 0),
      frases: agrupadas.map(f => ({
        id: f._id, respuesta_id: f.respuestaId, texto: f.texto, cita: f.cita, emocion: f.emocion,
        intensidad: f.intensidad, cluster_id: f.temaId, conceptos: f.conceptos,
      })),
      respuestas: rs.map(r => ({ id: r._id, texto: r.texto })),
    };
  },
});

// ---------- pipeline internals (used by procesar.ts) ----------

export async function pedirAgrupar(ctx: { db: any; scheduler: any }, encuestaId: Id<"encuestas">) {
  const token = Date.now();
  await ctx.db.patch(encuestaId, { agruparPedido: token });
  await ctx.scheduler.runAfter(1500, internal.procesar.agrupar, { encuestaId, token });
}

export const leerRespuesta = internalQuery({
  args: { respuestaId: v.id("respuestas") },
  handler: async (ctx, { respuestaId }) => {
    const r = await ctx.db.get(respuestaId);
    return r && { respuesta: r, encuesta: (await ctx.db.get(r.encuestaId))! };
  },
});

export const guardarFrases = internalMutation({
  args: {
    respuestaId: v.id("respuestas"),
    frases: v.array(v.object({ texto: v.string(), cita: v.string(), emocion: v.string(), intensidad: v.number(), conceptos: v.array(v.string()) })),
  },
  handler: async (ctx, { respuestaId, frases }) => {
    const r = await ctx.db.get(respuestaId);
    if (!r) return; // deleted while processing
    for (const f of await ctx.db.query("frases").withIndex("by_respuesta", q => q.eq("respuestaId", respuestaId)).collect()) await ctx.db.delete(f._id);
    for (const f of frases) await ctx.db.insert("frases", { ...f, encuestaId: r.encuestaId, respuestaId, intensidad: Math.max(0, Math.min(1, f.intensidad)) });
    await ctx.db.patch(respuestaId, { estado: "listo" });
    await pedirAgrupar(ctx, r.encuestaId);
  },
});

export const marcarError = internalMutation({
  args: { respuestaId: v.id("respuestas") },
  handler: async (ctx, { respuestaId }) => { if (await ctx.db.get(respuestaId)) await ctx.db.patch(respuestaId, { estado: "error" }); },
});

export const leerParaAgrupar = internalQuery({
  args: { encuestaId: v.id("encuestas"), token: v.number() },
  handler: async (ctx, { encuestaId, token }) => {
    const e = await ctx.db.get(encuestaId);
    if (!e || e.agruparPedido !== token) return null; // a newer request superseded this one
    const frases = await ctx.db.query("frases").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).collect();
    const temas = await ctx.db.query("temas").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).collect();
    return { pregunta: e.pregunta, frases: frases.map(f => ({ id: f._id, texto: f.texto })), temas: temas.map(t => ({ id: t.tid, nombre: t.nombre })) };
  },
});

export const guardarTemas = internalMutation({
  args: {
    encuestaId: v.id("encuestas"),
    temas: v.array(v.object({ id: v.string(), nombre: v.string(), resumen: v.string(), x: v.number(), y: v.number() })),
    asignacion: v.array(v.object({ frase: v.string(), tema: v.string() })),
  },
  handler: async (ctx, { encuestaId, temas, asignacion }) => {
    for (const t of await ctx.db.query("temas").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).collect()) await ctx.db.delete(t._id);
    for (const t of temas) await ctx.db.insert("temas", { encuestaId, tid: t.id, nombre: t.nombre, resumen: t.resumen, x: t.x, y: t.y });
    const tids = new Set(temas.map(t => t.id));
    const a = new Map(asignacion.map(x => [x.frase, x.tema]));
    for (const f of await ctx.db.query("frases").withIndex("by_encuesta", q => q.eq("encuestaId", encuestaId)).collect()) {
      const t = a.get(f._id);
      if (t && tids.has(t)) await ctx.db.patch(f._id, { temaId: t });
      // Frases added after this grouping started keep their old tema; the regroup they scheduled will place them.
    }
  },
});
