import { Pill, type Tone } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Carpeta, DocumentKind, DocumentStatus } from "../../types";
import { formatDate, PageHeader, remaining, STAGES } from "../../ui";
import { ReminderButton } from "./reminder-button";

export const dynamic = "force-dynamic";

const COLUMNS: { kind: DocumentKind; label: string }[] = [
  { kind: "rsh", label: "RSH" },
  { kind: "cedula", label: "Cédula" },
  { kind: "dj49_1", label: "DJ49-1" },
  { kind: "dj49_2", label: "DJ49-2" },
  { kind: "dj49_3", label: "DJ49-3" },
  { kind: "ahorro", label: "Ahorro 10 UF" },
  { kind: "comunidad", label: "Comunidad" },
];

const STATUSES: Record<DocumentStatus, { label: string; tone: Tone }> = {
  listo: { label: "Listo", tone: "ok" },
  falta: { label: "Falta", tone: "alerta" },
  vence: { label: "Vence", tone: "aviso" },
  no_aplica: { label: "—", tone: "neutro" },
};

export default async function CarpetaPage({ params }: { params: Promise<{ comite: string }> }) {
  const { comite } = await params;
  const carpeta = await apiGet<Carpeta>(`/ep/comites/${comite}/carpeta`);
  const { deadline, composition, next_assembly: assembly } = carpeta;
  const above = composition.total - composition.in_rsh_40;
  return (
    <>
      <PageHeader
        title={`Carpeta del grupo · ${carpeta.name}`}
        subtitle={`${carpeta.family_count} familias · ${STAGES[carpeta.stage].label.toLowerCase()}`}
      />
      {deadline && (
        <section
          className={`flex items-center gap-6 rounded-3xl px-6 py-5 ${deadline.critical ? "bg-alerta-claro" : "bg-aviso-claro"}`}
          data-testid="plazo-carpeta"
        >
          <p className={`shrink-0 text-2xl font-bold ${deadline.critical ? "text-alerta" : "text-aviso"}`}>
            {remaining(deadline)}
          </p>
          <p className="text-sm">
            {deadline.note?.replace(/\.$/, "") ?? `${deadline.title}: vence el ${formatDate(deadline.due_on)}`}
            {deadline.article && ` (${deadline.article})`}.
            {carpeta.missing > 0 && ` Faltan ${carpeta.missing} carpetas.`}
          </p>
        </section>
      )}
      <div className="overflow-x-auto rounded-3xl border border-linea bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-suave">
            <tr>
              <th className="px-4 py-3 font-medium">Familia</th>
              {COLUMNS.map((column) => (
                <th key={column.kind} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carpeta.families.map((family) => (
              <tr key={family.id} className="border-t border-linea">
                <td className="px-4 py-2.5 whitespace-nowrap">{family.name}</td>
                {COLUMNS.map((column) => {
                  const status = STATUSES[family.documents[column.kind] ?? "falta"];
                  return (
                    <td key={column.kind} className="px-4 py-2.5">
                      <Pill tone={status.tone}>{status.label}</Pill>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-3xl border border-linea bg-white p-5" data-testid="composicion">
          <h2 className="font-semibold">Composición del grupo</h2>
          <p className="mt-1 text-sm">
            {composition.in_rsh_40} de {composition.total} familias ({composition.share_percent}%) en el 40% del RSH.{" "}
            {composition.compliant
              ? "Cumple el máximo de 30% sobre el 40% (art. 1)."
              : `${above} familias sobre el 40%: pasa el máximo de 30% (art. 1).`}
          </p>
        </section>
        <section className="rounded-3xl border border-linea bg-white p-5">
          <h2 className="font-semibold">Próxima asamblea</h2>
          <p className="mt-1 text-sm">
            {assembly
              ? `${formatDate(assembly.due_on)} · ${assembly.title}.${assembly.note ? ` ${assembly.note}` : ""}`
              : "No hay asamblea agendada."}
          </p>
        </section>
      </div>
      {carpeta.missing > 0 && <ReminderButton slug={carpeta.slug} />}
    </>
  );
}
