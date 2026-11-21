// shortcut: fixed data for the E4 shell, replace with the API when /ep/carpetas gets an endpoint.
import type { Tone } from "@/components/ui";

export type FamilyFolder = {
  name: string;
  progress: string;
  detail: string;
  tone: Tone;
  status: string;
  /** Initials of the acompañante. Without it the card shows nothing, or "Sin acompañante" when unassigned. */
  helper?: string;
  unassigned?: boolean;
  selected?: boolean;
};

export const GROUP = {
  name: "Comité Los Aromos",
  subtitle: "40 familias · fecha máxima de calificación 14-03-2027",
  reminder: "Recordar a las 6",
};

export const FILTERS = ["Todas 40", "Falta 3", "Por vencer 3", "Listas 34"];

export const FOLDERS: FamilyFolder[] = [
  { name: "Familia Rojas", progress: "6 / 7", detail: "Falta el ahorro", tone: "aviso", status: "Por vencer", helper: "VS", selected: true },
  { name: "Familia Pérez", progress: "6 / 7", detail: "Falta mandato de ahorro", tone: "alerta", status: "Falta", unassigned: true },
  { name: "Familia Herrera", progress: "4 / 7", detail: "Faltan 3 documentos", tone: "alerta", status: "Falta", helper: "JL" },
  { name: "Familia Castro", progress: "5 / 7", detail: "RSH desactualizado", tone: "alerta", status: "Falta", helper: "AM" },
  { name: "Familia Soto", progress: "6 / 7", detail: "Ahorro: faltan 0,5 UF", tone: "aviso", status: "Por vencer", helper: "VS" },
  { name: "Familia Muñoz", progress: "7 / 7", detail: "Carpeta completa", tone: "ok", status: "Lista" },
];

export const CHAT = {
  question: "¿Qué familias pueden atrasar la postulación?",
  answer:
    "Tres familias tienen documentos pendientes y tres están por vencer. La más urgente es la Familia Pérez: le falta el mandato de ahorro y no tiene acompañante.",
  summary: [
    { state: "ok", text: "34 familias con la carpeta completa" },
    { state: "ok", text: "Familia Rojas firmó hoy (6 de 7)" },
    { state: "falta", text: "Pérez, Herrera y Castro: faltan documentos" },
    { state: "ok", text: "Asamblea con quórum (31 de 40)" },
    { state: "aviso", text: "Rojas, Soto y Díaz: ahorro por vencer" },
  ] as const,
  reminder: "Recuerda que el último día para reemplazar familias es el 13-03-2027.",
  suggestions: ["Recordar a las 3 con faltantes", "Redactar acta de la asamblea", "¿Qué dice el art. 13?"],
};
