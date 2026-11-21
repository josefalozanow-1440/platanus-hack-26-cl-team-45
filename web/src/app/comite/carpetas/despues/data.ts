// Fixed data of C1b: the group right after Pedro Rojas signed the DJ49-1.
import type { ComiteCarpetas, MissingFolder } from "../../types";

export const AFTER_SIGNATURE: ComiteCarpetas = {
  slug: "los-aromos",
  name: "Comité Los Aromos",
  counts: { complete: 34, missing: 3, expiring: 3, total: 40 },
  composition: { in_rsh_40: 29, total: 40, share_percent: 72, compliant: true },
  savings_cutoff: {
    deadline: {
      kind: "savings_cutoff",
      title: "Corte del ahorro",
      due_on: "2026-12-31",
      business_days: false,
      remaining_days: 40,
      total_days: null,
      article: null,
      note: null,
      critical: false,
    },
    below_minimum: 2,
  },
  missing: [
    { id: 1, name: "Familia Pérez", done: 6, total: 7, missing_label: "Falta el mandato de ahorro", companion_name: null },
    { id: 2, name: "Familia Herrera", done: 4, total: 7, missing_label: "Faltan 3 documentos", companion_name: "Jorge" },
    { id: 3, name: "Familia Castro", done: 5, total: 7, missing_label: "Falta RSH actualizado", companion_name: "Ana" },
  ],
  hidden: 0,
};

export const EXPIRING: MissingFolder[] = [
  { id: 4, name: "Familia Rojas", done: 6, total: 7, missing_label: "Falta el ahorro · corte 31-12", companion_name: "Valentina" },
];

export const FOLIO_LINE = {
  title: "Folio avisó a Marta y a la entidad",
  detail: "La observación 3 ya se puede responder",
};
