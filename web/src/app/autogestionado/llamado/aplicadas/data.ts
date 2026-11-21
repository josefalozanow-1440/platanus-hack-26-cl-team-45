// shortcut: fixed data for the E5b shell, replace when the API applies the rules of a llamado.
import type { Tone } from "@/components/ui";

export const BANNER = "9 reglas aplicadas por Valentina Soto · 38 familias avisadas · Res. Ex. 1.150 manda sobre el reglamento para este grupo";

/** Steps of the group's path. The ones with `before` changed with the llamado and show in yellow. */
export const STEPS: { title: string; value: string; before?: string; cite: string }[] = [
  { title: "Ingreso de antecedentes", value: "Sistema Umbral", cite: "resuelvo 9" },
  { title: "Revisión del SERVIU", value: "15 días hábiles", before: "antes 30", cite: "resuelvo 10.1" },
  { title: "Corrección, en un solo acto", value: "10 días hábiles o la postulación se elimina", before: "antes 60", cite: "resuelvo 10.2" },
  { title: "Reevaluación", value: "10 días hábiles", before: "antes 15", cite: "resuelvo 10.3" },
  { title: "Selección", value: "Por orden de CPA hasta agotar 100.000 UF", before: "antes por puntaje", cite: "resuelvos 6 y 10.4" },
];

export const FOLIO_DID: { dot: string; text: string }[] = [
  { dot: "bg-ok", text: "Recalculó los plazos de las 38 carpetas y de la postulación del grupo" },
  {
    dot: "bg-primario",
    text: "Apagó el puntaje del grupo: en este llamado se selecciona por orden de llegada, así que lo que importa es postular completos y pronto",
  },
  {
    dot: "bg-primario",
    text: "Agregó una tarea a la directiva: firmar el convenio con el SERVIU, porque el grupo actúa como su propia entidad (resuelvo 8)",
  },
  { dot: "bg-ok", text: "Avisó a las 38 familias con lo que cambia para cada una" },
];

export const AFFECTED: { badge: string; badgeTone: Tone; text: string; pill: string; pillTone: Tone }[] = [
  { badge: "FG", badgeTone: "aviso", text: "3 familias sobre el 40% del RSH ahora necesitan 15 UF de ahorro (antes 10)", pill: "Faltan 5 UF", pillTone: "aviso" },
  { badge: "DI", badgeTone: "info", text: "La directiva tiene 10 días hábiles, no 60, para responder observaciones", pill: "Más corto", pillTone: "aviso" },
  { badge: "35", badgeTone: "ok", text: "35 familias: nada cambia en su carpeta", pill: "Sin cambios", pillTone: "ok" },
];
