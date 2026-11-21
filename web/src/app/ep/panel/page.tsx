import Link from "next/link";

import { Pill, Stat, type Tone } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Deadline, Panel, PanelRow } from "../types";
import { formatDate, formatWait, PageHeader, remaining, STAGES } from "../ui";

export const dynamic = "force-dynamic";

const MONTHS_PER_YEAR = 12;
// A comité with at least this share of complete carpetas shows in yellow instead of red.
const ALMOST_COMPLETE = 0.8;

function foldersTone({ complete, total }: PanelRow["folders"]): Tone {
  if (complete === total) return "ok";
  return complete / total >= ALMOST_COMPLETE ? "aviso" : "alerta";
}

function DeadlineCell({ deadline }: { deadline: Deadline }) {
  if (deadline.critical) {
    return (
      <div className="flex flex-col items-start gap-1">
        <Pill tone="alerta">{remaining(deadline)}</Pill>
        <p className="text-[13px]">{deadline.note ?? deadline.title}</p>
      </div>
    );
  }
  return (
    <div>
      <p>{deadline.title}</p>
      <p className="text-[13px]">
        {remaining(deadline).replace("Quedan ", "")} · vence {formatDate(deadline.due_on)}
      </p>
    </div>
  );
}

function Row({ row }: { row: PanelRow }) {
  const { folders, observations } = row;
  const stage = STAGES[row.stage];
  const pending = observations.total - observations.answered;
  const subline = [
    folders.missing && `${folders.missing} con faltantes`,
    folders.expiring && `${folders.expiring} por vencer`,
  ].filter(Boolean);
  return (
    <tr className="border-t border-linea align-top" data-testid={`fila-${row.slug}`}>
      <td className="px-4 py-4 whitespace-nowrap">
        <Link href={`/ep/carpeta/${row.slug}`} className="hover:underline">
          {row.name.replace(/^Comité /, "")}
        </Link>
        <p className="text-[13px]">{folders.total} familias</p>
      </td>
      <td className="px-4 py-4">
        <Pill tone={foldersTone(folders)}>
          {folders.complete} de {folders.total}
        </Pill>
        {subline.length > 0 && <p className="mt-1 text-[13px]">{subline.join(" · ")}</p>}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <Pill tone={stage.tone}>{stage.label}</Pill>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-3">
          {row.deadlines.map((deadline) => (
            <DeadlineCell key={deadline.kind} deadline={deadline} />
          ))}
          {row.deadlines.length === 0 && "—"}
        </div>
      </td>
      <td className="px-4 py-4">
        {observations.total === 0 && "—"}
        {pending > 0 && (
          <Link href={`/ep/observaciones?comite=${row.slug}`} className="hover:underline">
            {pending} de {observations.total} pendiente{pending > 1 && "s"}
            {observations.pending_assignee && <span className="block text-[13px]">Asignada a {observations.pending_assignee}</span>}
          </Link>
        )}
        {observations.total > 0 && pending === 0 && (
          <Link href={`/ep/observaciones?comite=${row.slug}`} className="hover:underline">
            {observations.last_answered?.replace(/\.$/, "")}
          </Link>
        )}
      </td>
      <td className="px-4 py-4">{formatWait(row.wait_months)}</td>
    </tr>
  );
}

export default async function PanelPage() {
  const panel = await apiGet<Panel>("/ep/panel");
  const wait = panel.average_wait_months;
  return (
    <>
      <PageHeader
        title="Panel de grupos"
        subtitle={`${panel.comite_count} comités · ${panel.family_count} familias · datos ficticios`}
      />
      <div className="grid grid-cols-2 gap-4 lg:flex">
        <Stat tone="ok" value={`${panel.families_complete} de ${panel.family_count}`} label="familias con carpeta completa" />
        <Stat
          tone="alerta"
          value={panel.critical_deadlines}
          label={panel.critical_deadlines === 1 ? "plazo crítico esta semana" : "plazos críticos esta semana"}
        />
        <Stat
          tone="info"
          value={`${panel.observations_answered} de ${panel.observations_total}`}
          label="observaciones del SERVIU resueltas"
        />
        <Stat
          tone="aviso"
          value={`${Math.floor(wait / MONTHS_PER_YEAR)}a ${wait % MONTHS_PER_YEAR}m`}
          label="espera promedio desde que se organizó cada comité"
        />
      </div>
      <div className="overflow-x-auto rounded-3xl border border-linea bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-fondo/60 text-xs text-suave">
            <tr>
              <th className="px-4 py-3 font-medium">Comité</th>
              <th className="px-4 py-3 font-medium">Carpetas</th>
              <th className="px-4 py-3 font-medium">Etapa</th>
              <th className="px-4 py-3 font-medium">Próximo plazo</th>
              <th className="px-4 py-3 font-medium">Observaciones</th>
              <th className="px-4 py-3 font-medium">Espera desde que se organizó</th>
            </tr>
          </thead>
          <tbody>
            {panel.comites.map((row) => (
              <Row key={row.slug} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-3xl bg-primario-claro px-5 py-4 text-sm text-primario">
        Multiplayer: cada carpeta la completan entre las familias, el comité y tu equipo, antes y después del subsidio.
        Terreno, permisos, obra y pagos los resuelven sus responsables; Folio los sigue y avisa a todos.
      </p>
    </>
  );
}
