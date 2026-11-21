// Fixed data of E2b: the observations of Los Aromos right after Pedro Rojas signs the DJ49-1.
import type { ViewPage } from "../view";

export const BANNER = "Pedro Rojas firmó la DJ49-1 con ClaveÚnica. La observación 3 quedó lista para responder.";

export const AFTER_SIGNATURE: ViewPage = {
  slug: "los-aromos",
  name: "Los Aromos",
  round: 1,
  received_on: "2026-11-12",
  deadline: {
    kind: "observaciones",
    title: "Responder observaciones del SERVIU",
    due_on: "2027-02-05",
    business_days: true,
    remaining_days: 57,
    total_days: 60,
    article: "art. 13 inc. 3",
    note: null,
    critical: false,
  },
  answered: 3,
  family_message: "La entidad ya tiene listas las 3 respuestas al SERVIU. Tu firma, Pedro, era la última.",
  observations: [
    {
      id: 1,
      number: 1,
      category: "tecnica",
      description: "Plano de loteo: falta cota de nivel en el lote 12.",
      assignee_role: "Arquitecto",
      assignee_name: "Carla Ibáñez",
      draft_answer: null,
      draft_accepted_by: "Carla Ibáñez",
      note: null,
      answered: true,
    },
    {
      id: 2,
      number: 2,
      category: "presupuesto",
      description: "Partida de urbanización sin respaldo de cotización.",
      assignee_role: "Equipo EP",
      assignee_name: "Jorge Lagos",
      draft_answer: null,
      draft_accepted_by: "Jorge Lagos",
      note: null,
      answered: true,
    },
    {
      id: 3,
      number: 3,
      category: "familias",
      description: "Familia Rojas: DJ49-1 sin la firma de un integrante mayor de 18 años.",
      assignee_role: "Familia Rojas",
      assignee_name: "Marta Rojas",
      draft_answer: null,
      draft_accepted_by: "Jorge Lagos",
      note: "Pedro firmó con ClaveÚnica hoy a las 10:41. Marta y el comité ya fueron avisados.",
      follow_up: "La carpeta de la Familia Rojas quedó en 6 de 7 (falta el ahorro).",
      answered: true,
    },
  ],
};
