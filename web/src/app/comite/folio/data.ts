// Fixed conversation of C3: the directiva asks Folio what the group still needs.
export const QUESTION = "¿Qué nos falta para postular?";
export const INTRO = "Les falta poco. Esto es lo que tiene que estar listo antes de la fecha máxima de calificación:";

export const DEADLINE = {
  date: "14-03-2027",
  text: "Fecha máxima de calificación del llamado. El último día para reemplazar familias es el 13-03.",
  remaining: "Faltan 113 días",
  cite: "arts. 14 y 20",
};

export const REPORT: { title: string; items: { state: "ok" | "falta" | "aviso"; text: string }[]; summary: string; cite: string } = {
  title: "Carpetas del grupo",
  items: [
    { state: "ok", text: "34 familias con la carpeta completa" },
    { state: "ok", text: "Familia Rojas firmó hoy (6 de 7)" },
    { state: "falta", text: "Pérez, Herrera y Castro: faltan documentos" },
    { state: "ok", text: "Asamblea de tipología con quórum" },
    { state: "aviso", text: "Rojas, Soto y Díaz: ahorro antes del 31-12" },
  ],
  summary: "34 de 40 listas",
  cite: "art. 3 · art. 39",
};

export const OFFER =
  "La Familia Pérez no tiene acompañante. ¿Quieres que les recuerde a las 3 familias con faltantes, o prefieres hacerlo tú?";

// Quick questions under the chat. The ones with href open the screen that answers them.
export const SUGGESTIONS = [
  { text: "Redacta el acta de la asamblea", href: "/comite/asamblea" },
  { text: "¿Qué pasa si alguien renuncia?", href: "/comite/reemplazo" },
];
