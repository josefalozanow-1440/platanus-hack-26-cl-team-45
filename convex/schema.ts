import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  encuestas: defineTable({
    pregunta: v.string(),
    slug: v.string(), // URL key: /<slug>
    abierta: v.boolean(),
    // Debounce token: only the latest scheduled regroup runs.
    agruparPedido: v.optional(v.number()),
    normalizarPedido: v.optional(v.number()), // same debounce for the tópicos regroup
  }).index("by_slug", ["slug"]),
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
  // Haiku's reading of the whole answer, one row per respuesta. topicoId is filled by the normalizar step.
  analisis: defineTable({
    encuestaId: v.id("encuestas"),
    respuestaId: v.id("respuestas"),
    temas: v.array(v.object({
      tema: v.string(),
      direccion: v.string(), // positivo | negativo | neutro | mixto
      intensidad: v.union(v.string(), v.null()), // leve | moderada | fuerte, only for positivo/negativo
      tendencia: v.string(), // mejora | igual | empeora | no_dice
      cita: v.string(),
      topicoId: v.optional(v.string()),
    })),
    emocion: v.string(),
    propone: v.union(v.string(), v.null()),
  })
    .index("by_encuesta", ["encuestaId"])
    .index("by_respuesta", ["respuestaId"]),
  // Neutral topics ("de qué se habla") shared by the whole poll; stance lives in each analisis tema.
  topicos: defineTable({
    encuestaId: v.id("encuestas"),
    tid: v.string(),
    nombre: v.string(),
    descripcion: v.string(),
  }).index("by_encuesta", ["encuestaId"]),
  temas: defineTable({
    encuestaId: v.id("encuestas"),
    tid: v.string(),
    nombre: v.string(),
    resumen: v.string(),
    x: v.number(),
    y: v.number(),
  }).index("by_encuesta", ["encuestaId"]),
});
