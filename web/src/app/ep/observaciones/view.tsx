// Body of the observations screen. E2 feeds it from the API and E2b with fixed data.
import type { ReactNode } from "react";

import { Cite, FolioCard } from "@/components/folio";
import { BUTTON, Callout, Card, Pill } from "@/components/ui";

import { acceptDraft } from "../actions";
import type { Deadline, Observation, ObservationsPage } from "../types";
import { formatDate, PageHeader } from "../ui";

/** `follow_up` is the green second line of the note. The API does not send it yet. */
export type ViewObservation = Observation & { follow_up?: string };
export type ViewPage = Omit<ObservationsPage, "observations"> & { observations: ViewObservation[] };

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
    text: "Si no se responde a tiempo, el SERVIU PUEDE rechazar y devolver todo.",
    tone: "aviso",
  },
  {
    when: "Si quedan observaciones de familias",
    title: "2ª ronda (optativa)",
    text: "El SERVIU puede dar 20 días hábiles más a la EP y 10 para reevaluar.",
    tone: "neutro",
  },
  { when: "Si no se resuelven", title: "Rechazo obligatorio", text: "Art. 13 inc. 5.", tone: "alerta" },
] as const;

// shortcut: dato fijo, the API has no presence ("who is in this expediente now").
const PEOPLE = [
  { name: "Carla Ibáñez · Arquitecta", dot: "bg-ok" },
  { name: "Jorge Lagos · EP", dot: "bg-primario" },
  { name: "Valentina Soto · Comité", dot: "bg-aviso" },
];
// shortcut: dato fijo, the API does not send the legal sources of a draft.
const DRAFT_SOURCES = ["art. 3 h D.S. 49", "art. 13"];

const SMALL_BUTTON = "rounded-xl px-3 py-1.5 text-xs font-semibold";

/** "Vence el 05-02-2027 (60 días hábiles, art. 13 inc. 3)." */
function dueLine(deadline: Deadline): string {
  const unit = deadline.business_days ? "días hábiles" : "días";
  const extra = [deadline.total_days && `${deadline.total_days} ${unit}`, deadline.article].filter(Boolean);
  return `Vence el ${formatDate(deadline.due_on)}${extra.length ? ` (${extra.join(", ")})` : ""}.`;
}

function Draft({ observation: o }: { observation: ViewObservation }) {
  return (
    <FolioCard label="Borrador de respuesta" className="mt-3">
      <p className="flex items-center gap-2.5 text-sm font-semibold">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primario-claro text-xs text-primario">
          {o.number}
        </span>
        {o.description}
      </p>
      <p className="mt-3 rounded-2xl bg-fondo px-4 py-3 text-sm">{o.draft_answer}</p>
      <p className="mt-3 flex gap-1.5">
        {DRAFT_SOURCES.map((source) => (
          <Cite key={source}>{source}</Cite>
        ))}
      </p>
      <form action={acceptDraft} className="mt-3 flex gap-2">
        <input type="hidden" name="id" value={o.id} />
        <button type="submit" className={`${SMALL_BUTTON} bg-primario text-white`}>
          Aceptar
        </button>
        <button type="button" className={`${SMALL_BUTTON} bg-fondo`}>
          Editar
        </button>
        <button type="button" className={`${SMALL_BUTTON} border border-linea`}>
          Descartar
        </button>
      </form>
    </FolioCard>
  );
}

function ObservationCard({ observation: o }: { observation: ViewObservation }) {
  const who = [o.assignee_role, o.assignee_name].filter(Boolean).join(" · ");
  return (
    <article className="rounded-3xl border border-linea bg-white p-5" data-testid={`observacion-${o.number}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">
          Observación {o.number} · {CATEGORIES[o.category]}
        </h2>
        <Pill tone={o.answered ? "ok" : "alerta"}>{o.answered ? "Respondida" : "Pendiente"}</Pill>
      </div>
      <p className="mt-2 text-sm">{o.description}</p>
      {who && <p className="mt-1 text-[13px] text-primario">Asignada a: {who}</p>}
      {o.note && (
        <p className="mt-3 rounded-2xl bg-fondo px-4 py-3 text-[13px]">
          {o.note}
          {o.follow_up && <span className="mt-0.5 block text-ok">{o.follow_up}</span>}
        </p>
      )}
      {o.draft_accepted_by && (
        <p className="mt-3 rounded-xl bg-ok-claro px-4 py-2 text-[13px] text-ok">
          Borrador del Folio aceptado por {o.draft_accepted_by} · art. 13
        </p>
      )}
      {o.draft_answer && !o.draft_accepted_by && <Draft observation={o} />}
    </article>
  );
}

function SingleAnswer({ page }: { page: ViewPage }) {
  const total = page.observations.length;
  const ready = page.answered === total;
  return (
    <Card className="flex flex-col gap-2 border border-linea">
      <h2 className="font-semibold">Respuesta única</h2>
      <p className="text-[13px] text-suave" data-testid="respuesta-progreso">
        {page.answered} de {total} observaciones listas{ready && " · lista para ingresar"}
      </p>
      <div className="h-2 rounded-full bg-fondo">
        <div
          className={`h-2 rounded-full ${ready ? "bg-ok" : "bg-primario"}`}
          style={{ width: `${(page.answered / total) * 100}%` }}
        />
      </div>
      <button type="button" className={BUTTON.primary}>
        Preparar respuesta única
      </button>
      <a href={`/ep/observaciones/respuesta?comite=${page.slug}`} className={BUTTON.secondary}>
        Descargar respuesta
      </a>
      <p className="mt-1 text-xs text-suave">
        Folio arma el paquete. Tu equipo lo ingresa en el sistema del MINVU: no enviamos nada al SERVIU.
      </p>
    </Card>
  );
}

export function ObservationsView({ page, banner }: { page: ViewPage; banner?: ReactNode }) {
  const received = page.received_on ? `Recibidas el ${formatDate(page.received_on)} en el sistema del MINVU · ` : "";
  return (
    <>
      <PageHeader
        title={`Observaciones del SERVIU · ${page.name.replace(/^Comité /, "")}`}
        subtitle={`${received}${ROUNDS[page.round - 1] ?? `ronda ${page.round}`} ronda`}
      />
      {banner}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        {page.deadline && (
          <div className="grid" data-testid="plazo-observaciones">
            <Callout tone="alerta" label="Responder en un solo acto">
              <p className="mt-1 text-4xl font-bold text-alerta">
                {page.deadline.remaining_days} {page.deadline.business_days ? "días hábiles" : "días"}
              </p>
              <p className="mt-2 text-sm">{dueLine(page.deadline)}</p>
            </Callout>
          </div>
        )}
        <div className="grid gap-3 rounded-3xl sm:grid-cols-3 border border-linea bg-white p-3">
          {SCENARIOS.map((s) => (
            <Callout key={s.title} tone={s.tone} label={s.when}>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-[13px]">{s.text}</p>
            </Callout>
          ))}
        </div>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          {page.observations.map((o) => (
            <ObservationCard key={o.id} observation={o} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <SingleAnswer page={page} />
          <Card className="border border-linea">
            <h2 className="text-sm font-semibold">En este expediente ahora</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-[13px]">
              {PEOPLE.map((person) => (
                <li key={person.name} className="flex items-center gap-2">
                  <span aria-hidden className={`size-2 rounded-full ${person.dot}`} />
                  {person.name}
                </li>
              ))}
            </ul>
          </Card>
          <section className="rounded-3xl bg-primario-claro p-5 text-[13px]">
            <h2 className="font-semibold text-primario">Lo que ven las familias</h2>
            <p className="mt-1">{`"${page.family_message}"`}</p>
          </section>
        </div>
      </div>
    </>
  );
}
