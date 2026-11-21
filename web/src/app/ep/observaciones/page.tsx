import { redirect } from "next/navigation";

import { Pill } from "@/components/ui";
import { apiGet } from "@/lib/api";

import { acceptDraft } from "../actions";
import type { Deadline, Observation, ObservationsPage, Panel } from "../types";
import { Empty, formatDate, PageHeader } from "../ui";

export const dynamic = "force-dynamic";

const CATEGORIES: Record<Observation["category"], string> = {
  tecnica: "Técnica",
  presupuesto: "Presupuesto",
  familias: "Familias",
};
const ROUNDS = ["primera", "segunda", "tercera"];

const SCENARIOS = [
  {
    when: "Ahora",
    title: "1ª ronda",
    text: "Si no se responde a tiempo, el SERVIU puede rechazar y devolver todo.",
    tone: "bg-aviso-claro",
  },
  {
    when: "Si quedan observaciones de familias",
    title: "2ª ronda (optativa)",
    text: "El SERVIU puede dar 20 días hábiles más a la EP y 10 para reevaluar.",
    tone: "bg-fondo",
  },
  { when: "Si no se resuelven", title: "Rechazo obligatorio", text: "Art. 13 inc. 5.", tone: "bg-alerta-claro" },
];

/** "Vence el 05-02-2027 (58 días hábiles en total, art. 13 inc. 3)." */
function dueLine(deadline: Deadline): string {
  const unit = deadline.business_days ? "días hábiles" : "días";
  const extra = [deadline.total_days && `${deadline.total_days} ${unit} en total`, deadline.article].filter(Boolean);
  return `Vence el ${formatDate(deadline.due_on)}${extra.length ? ` (${extra.join(", ")})` : ""}.`;
}

function assignee(o: Observation): string | null {
  const parts = [o.assignee_role, o.assignee_name].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function ObservationCard({ observation: o }: { observation: Observation }) {
  const who = assignee(o);
  return (
    <article className="rounded-3xl border border-linea bg-white p-5" data-testid={`observacion-${o.number}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">
          Observación {o.number} · {CATEGORIES[o.category]}
        </h2>
        <Pill tone={o.answered ? "ok" : "alerta"}>{o.answered ? "Respondida" : "Pendiente"}</Pill>
      </div>
      <p className="mt-2 text-sm">{o.description}</p>
      {who && <p className="mt-1 text-sm text-primario">Le corresponde a: {who}</p>}
      {o.note && (
        <p className="mt-3 rounded-2xl bg-fondo px-4 py-3 text-sm">{o.note}</p>
      )}
      {o.draft_accepted_by && (
        <p className="mt-3 rounded-2xl bg-ok-claro px-4 py-2 text-sm text-ok">
          Borrador del Copiloto aceptado por {o.draft_accepted_by} · art. 13
        </p>
      )}
      {o.draft_answer && !o.draft_accepted_by && (
        <div className="mt-3 rounded-2xl border border-linea p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-primario text-xs text-white">
                C
              </span>
              Copiloto
            </p>
            <p className="font-mono text-[11px] tracking-wider text-suave uppercase">Borrador de respuesta</p>
          </div>
          <p className="mt-3 rounded-2xl bg-fondo px-4 py-3 text-sm">{o.draft_answer}</p>
          <p className="mt-2 text-xs text-suave">Nadie lo ha aceptado. El copiloto no responde por nadie.</p>
          <form action={acceptDraft} className="mt-3">
            <input type="hidden" name="id" value={o.id} />
            <button type="submit" className="rounded-xl bg-primario px-4 py-2 text-sm font-semibold text-white">
              Aceptar borrador
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

function SingleAnswer({ page }: { page: ObservationsPage }) {
  const total = page.observations.length;
  const ready = page.answered === total;
  const download = `/ep/observaciones/respuesta?comite=${page.slug}`;
  return (
    <section className="rounded-3xl border border-linea bg-white p-5">
      <h2 className="font-semibold">Respuesta única</h2>
      <p className="mt-1 text-sm text-suave" data-testid="respuesta-progreso">
        {page.answered} de {total} observaciones listas
      </p>
      <div className="mt-2 h-2 rounded-full bg-fondo">
        <div className="h-2 rounded-full bg-primario" style={{ width: `${(page.answered / total) * 100}%` }} />
      </div>
      {ready ? (
        <a
          href={download}
          className="mt-4 block rounded-xl bg-primario py-3 text-center text-sm font-semibold text-white"
        >
          Descargar respuesta única
        </a>
      ) : (
        <>
          <p className="mt-4 rounded-xl bg-fondo py-3 text-center text-sm font-semibold text-suave">
            Falta{total - page.answered > 1 && "n"} {total - page.answered} para la respuesta única
          </p>
          <a
            href={download}
            className="mt-2 block rounded-xl border border-linea py-3 text-center text-sm font-semibold"
          >
            Descargar borrador
          </a>
        </>
      )}
      <p className="mt-3 text-xs text-suave">
        El copiloto arma el paquete. Tu equipo lo ingresa en el sistema del MINVU: no enviamos nada al SERVIU.
      </p>
    </section>
  );
}

export default async function ObservacionesPage({ searchParams }: { searchParams: Promise<{ comite?: string }> }) {
  const { comite } = await searchParams;
  if (!comite) {
    const panel = await apiGet<Panel>("/ep/panel");
    const withObservations = panel.comites.filter((row) => row.observations.total > 0);
    const target =
      withObservations.find((row) => row.observations.answered < row.observations.total) ?? withObservations[0];
    if (!target) return <Empty>Ningún comité tiene observaciones del SERVIU.</Empty>;
    redirect(`/ep/observaciones?comite=${target.slug}`);
  }
  const page = await apiGet<ObservationsPage>(`/ep/comites/${comite}/observaciones`);
  if (page.observations.length === 0) return <Empty>{page.name} no tiene observaciones del SERVIU.</Empty>;
  const people = [...new Set(page.observations.map(assignee).filter((who): who is string => who !== null))];
  const received = page.received_on ? `Recibidas el ${formatDate(page.received_on)} en el sistema del MINVU · ` : "";
  return (
    <>
      <PageHeader
        title={`Observaciones del SERVIU · ${page.name}`}
        subtitle={`${received}${ROUNDS[page.round - 1] ?? `ronda ${page.round}`} ronda`}
      />
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        {page.deadline && (
          <section className="rounded-3xl bg-alerta-claro p-5 text-alerta" data-testid="plazo-observaciones">
            <p className="text-xs font-semibold uppercase">Responder en un solo acto</p>
            <p className="mt-2 text-4xl font-bold">
              {page.deadline.remaining_days} {page.deadline.business_days ? "días hábiles" : "días"}
            </p>
            <p className="mt-2 text-sm text-tinta">
              {dueLine(page.deadline)}
            </p>
          </section>
        )}
        <section className="grid grid-cols-3 gap-3 rounded-3xl border border-linea bg-white p-4">
          {SCENARIOS.map((s) => (
            <div key={s.title} className={`rounded-2xl p-4 ${s.tone}`}>
              <p className="text-[11px] font-semibold text-suave uppercase">{s.when}</p>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm">{s.text}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="grid grid-cols-[2fr_1fr] items-start gap-4">
        <div className="flex flex-col gap-3">
          {page.observations.map((o) => (
            <ObservationCard key={o.id} observation={o} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <SingleAnswer page={page} />
          <section className="rounded-3xl border border-linea bg-white p-5">
            <h2 className="font-semibold">A quién le corresponde</h2>
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {people.map((who) => (
                <li key={who}>{who}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-primario-claro p-5 text-sm">
            <h2 className="font-semibold text-primario">Lo que ven las familias</h2>
            <p className="mt-1">«{page.family_message}»</p>
          </section>
        </div>
      </div>
    </>
  );
}
