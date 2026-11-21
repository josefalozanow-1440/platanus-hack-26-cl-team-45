// Pieces shared by the three EP screens (E1, E2, E3). Generic pieces live in @/components/ui.
import type { ReactNode } from "react";

import type { Tone } from "@/components/ui";

import type { Deadline, Stage } from "./types";

export const STAGES: Record<Stage, { label: string; tone: Tone }> = {
  organizacion: { label: "Organización", tone: "neutro" },
  proyecto: { label: "Proyecto", tone: "neutro" },
  revision_serviu: { label: "Revisión SERVIU", tone: "info" },
  calificado: { label: "Calificado", tone: "ok" },
  subsidio_asignado: { label: "Subsidio asignado", tone: "info" },
  entrega: { label: "Entrega", tone: "ok" },
};

const MONTHS_PER_YEAR = 12;

/** "2027-02-05" -> "05-02-2027". */
export function formatDate(iso: string): string {
  return iso.slice(0, 10).split("-").reverse().join("-");
}

/** 40 -> "3 años y 4 meses". */
export function formatWait(months: number): string {
  const years = Math.floor(months / MONTHS_PER_YEAR);
  const rest = months % MONTHS_PER_YEAR;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? "año" : "años"}`);
  if (rest || !years) parts.push(`${rest} ${rest === 1 ? "mes" : "meses"}`);
  return parts.join(" y ");
}

/** "Quedan 37 de 180 días" or "52 días hábiles". */
export function remaining(deadline: Deadline): string {
  const unit = deadline.business_days ? "días hábiles" : "días";
  if (deadline.total_days) return `Quedan ${deadline.remaining_days} de ${deadline.total_days} ${unit}`;
  return `Quedan ${deadline.remaining_days} ${unit}`;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-suave">{subtitle}</p>
      </div>
      <span className="shrink-0 rounded-full bg-aviso-claro px-3 py-1 text-xs font-semibold text-aviso">
        Reglas: D.S. 49 base + resolución del llamado
      </span>
    </header>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-3xl bg-white p-8 text-center text-suave">{children}</p>;
}
