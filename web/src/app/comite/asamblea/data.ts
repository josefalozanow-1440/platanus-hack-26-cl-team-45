// shortcut: fixed data, the API has no assemblies or votes yet.
import type { Tone } from "@/components/ui";

export const ASSEMBLY = {
  eyebrow: "Asamblea · Comité Los Aromos",
  title: "¿Aprobamos la tipología de vivienda?",
  proposer: { initials: "VS", line: "Propuesta de Valentina Soto · directiva" },
  proposal: "Casas de dos pisos, 58 m² y 3 dormitorios (opción B del arquitecto). Es la que mejor calza con el terreno y el presupuesto.",
  plansLabel: "Ver planos de la opción B",
  options: ["De acuerdo", "Me abstengo", "En desacuerdo"],
  voteNote: "Tu voto lo ve el comité. Puedes cambiarlo hasta el cierre.",
  participation: { voted: 31, total: 40, minPercent: 70, minFamilies: 28 },
  folioNote:
    "Cierra el sábado 30-11 a las 18:00. Al cerrar armo el acta con nombre, RUT y firma de cada familia. Para aprobar el proyecto, el acta la firman todas las familias (Res. 1.875).",
};

type Voter = { initials: string; tone: Tone };

export const RESULTS: { label: string; count: number; bar: string; voters: Voter[] }[] = [
  {
    label: "De acuerdo",
    count: 24,
    bar: "bg-ok",
    voters: [
      { initials: "AM", tone: "ok" },
      { initials: "VS", tone: "aviso" },
      { initials: "JL", tone: "info" },
      { initials: "MR", tone: "alerta" },
    ],
  },
  {
    label: "Me abstengo",
    count: 4,
    bar: "bg-suave",
    voters: [
      { initials: "FC", tone: "info" },
      { initials: "FD", tone: "ok" },
    ],
  },
  {
    label: "En desacuerdo",
    count: 3,
    bar: "bg-alerta",
    voters: [
      { initials: "FH", tone: "alerta" },
      { initials: "FP", tone: "aviso" },
    ],
  },
];
