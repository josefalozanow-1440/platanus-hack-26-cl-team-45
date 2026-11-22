import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  encuestas: defineTable({
    pregunta: v.string(),
    abierta: v.boolean(),
    // Debounce token: only the latest scheduled regroup runs.
    agruparPedido: v.optional(v.number()),
  }),
  respuestas: defineTable({
    encuestaId: v.id("encuestas"),
    participante: v.string(), // anonymous id from the participant's browser
    texto: v.string(), // "" until the audio is transcribed
    audioId: v.optional(v.id("_storage")),
    estado: v.union(v.literal("transcribiendo"), v.literal("procesando"), v.literal("listo"), v.literal("error")),
  }).index("by_encuesta", ["encuestaId"]),
  frases: defineTable({
    encuestaId: v.id("encuestas"),
    respuestaId: v.id("respuestas"),
    texto: v.string(),
    cita: v.string(),
    emocion: v.string(),
    intensidad: v.number(),
    conceptos: v.array(v.string()),
    temaId: v.optional(v.string()),
  })
    .index("by_encuesta", ["encuestaId"])
    .index("by_respuesta", ["respuestaId"]),
  temas: defineTable({
    encuestaId: v.id("encuestas"),
    tid: v.string(),
    nombre: v.string(),
    resumen: v.string(),
    x: v.number(),
    y: v.number(),
  }).index("by_encuesta", ["encuestaId"]),
});
