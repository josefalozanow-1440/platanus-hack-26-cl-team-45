// shortcut: fixed data for the E5 shell, replace when the API reads a real llamado.
import type { Tone } from "@/components/ui";

export type RuleKind = "cambia" | "nueva" | "cumple";

export const KINDS: Record<RuleKind, { label: string; tone: Tone }> = {
  cambia: { label: "Cambia", tone: "aviso" },
  nueva: { label: "Nueva", tone: "info" },
  cumple: { label: "Cumple", tone: "ok" },
};

export type Rule = { title: string; kind: RuleKind; value: string; base: string; cite: string };

export const CALL = {
  subtitle:
    "Res. Ex. 1.150 (V. y U.), 28-07-2026 · llamado especial D.S. 49 para grupos autogestionados de la RM · 19 páginas escaneadas, leídas con OCR",
  summary:
    "Encontré 9 reglas. 5 cambian respecto del reglamento base y 2 son nuevas. Este llamado manda sobre el reglamento para tu grupo (art. 21). Revísalas antes de que las aplique a las 38 familias.",
  page: "Res. Ex. 1.150 · pág. 4 de 19",
  caption: "Las líneas destacadas son las que Folio usó. Cada regla de la derecha cita su resuelvo.",
  apply: "Aplicar 9 reglas a las 38 familias",
};

export const RULE_GROUPS: { title: string; rules: Rule[] }[] = [
  {
    title: "Plazos",
    rules: [
      { title: "Revisión del SERVIU", kind: "cambia", value: "15 días hábiles desde el Certificado de Ingreso", base: "Base: 30 días hábiles", cite: "resuelvo 10.1" },
      {
        title: "Corrección de observaciones",
        kind: "cambia",
        value: "10 días hábiles, todo en un solo acto. Si no, la postulación queda “eliminada”",
        base: "Base: 60 días hábiles, rechazo facultativo",
        cite: "resuelvo 10.2",
      },
      { title: "Reevaluación del SERVIU", kind: "cambia", value: "10 días hábiles", base: "Base: 15 días hábiles", cite: "resuelvo 10.3" },
      { title: "Terreno sin acreditar", kind: "nueva", value: "40 días hábiles no prorrogables desde la selección", base: "No existe en la ruta regular", cite: "resuelvo 12.1 a" },
    ],
  },
  {
    title: "Grupo",
    rules: [
      { title: "Tamaño del proyecto", kind: "cumple", value: "Hasta 40 viviendas · Las Araucarias tiene 38 familias", base: "Base: 10 a 160", cite: "resuelvos 1 y 13.3" },
      { title: "Antigüedad", kind: "cumple", value: "Personalidad jurídica con al menos 2 años", base: "No existe en la ruta regular", cite: "resuelvo 5" },
      { title: "Entidad patrocinante", kind: "nueva", value: "El grupo cumple ese rol, con convenio con el SERVIU", base: "Base: entidad externa con convenio marco", cite: "resuelvo 8" },
    ],
  },
  {
    title: "Selección y ahorro",
    rules: [
      {
        title: "Cómo se selecciona",
        kind: "cambia",
        value: "Por orden de obtención del CPA hasta agotar 100.000 UF. No se usa el puntaje",
        base: "Base: puntaje promedio del grupo (art. 22)",
        cite: "resuelvos 6 y 10.4",
      },
      { title: "Ahorro mínimo", kind: "cambia", value: "10 UF hasta el 40% del RSH; 15 UF sobre el 40%", base: "Base: 10 UF hasta el 50%", cite: "resuelvo 12.2" },
    ],
  },
];

/** Lines of the drawn page: width in % and, on the highlighted ones, the resuelvo Folio used. */
export const SCAN_LINES: { width: number; mark?: string }[] = [
  { width: 80 },
  { width: 62 },
  { width: 86 },
  { width: 36 },
  { width: 76, mark: "10.1" },
  { width: 80 },
  { width: 52 },
  { width: 70, mark: "10.2" },
  { width: 84 },
  { width: 78 },
  { width: 66 },
  { width: 82 },
  { width: 68, mark: "10.3" },
  { width: 80 },
  { width: 60 },
  { width: 76 },
  { width: 62 },
];
