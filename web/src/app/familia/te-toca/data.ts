// B1 · fixed data of the shell. Nothing here comes from the API yet.
import type { Activity } from "../grupo/people";

export const TE_TOCA = {
  person: "Marta Rojas",
  tabs: [
    { label: "Te toca", count: 2 },
    { label: "Menciones", count: 1 },
    { label: "Todo" },
  ],
  vote: {
    closes: "cierra sáb 18:00",
    title: "Asamblea: ¿aprobamos la tipología de vivienda?",
    turnout: "31 de 40 familias ya votaron",
  },
  savings: {
    due: "faltan 40 días",
    title: "Te faltan 0,5 UF antes del 31-12",
    body: "El banco certifica tu ahorro ese día (art. 39).",
  },
  mention: {
    initials: "VS",
    name: "Valentina Soto",
    meta: "comité · hace 12 min",
    text: "@Marta ¿te acompaño al banco el jueves para completar el ahorro?",
    replies: ["Sí, el jueves", "Otro día"],
  },
  activity: [
    { initials: "PR", tone: "alerta", text: "Pedro abrió tu invitación", when: "ahora", live: true },
    { initials: "F", tone: "info", text: "Folio: la observación 3 se responde apenas Pedro firme", when: "hace 1 min" },
    { initials: "AM", tone: "ok", text: "Ana Muñoz completó su carpeta", when: "hace 20 min" },
  ] satisfies Activity[],
};
