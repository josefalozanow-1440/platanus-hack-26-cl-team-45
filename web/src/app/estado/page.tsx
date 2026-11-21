// Project status for the team's humans: CI, recent commits and the state of D-/L-/E- items.
import type { ReactNode } from "react";

import { Card, Eyebrow, Pill, type Tone } from "@/components/ui";
import { apiGet } from "@/lib/api";

// Rendered on every request so it always shows the current repo state.
export const dynamic = "force-dynamic";

type CiStatus = "success" | "failure" | "in_progress" | "unknown";
type Commit = { sha: string; message: string; author: string; date: string; url: string };
type Item = { id: string; summary: string; status: string };
type RepoStatus = {
  repo_url: string;
  ci: { status: CiStatus; url: string | null; commit_sha: string | null; updated_at: string | null };
  commits: Commit[];
  product_items: Item[];
  engineering_items: Item[];
  fetched_at: string;
  errors: string[];
};

type Bucket = "Decidido" | "Propuesta" | "Otro";

const CI_LABELS: Record<CiStatus, { label: string; tone: Tone }> = {
  success: { label: "Todo pasa", tone: "ok" },
  failure: { label: "CI roto", tone: "alerta" },
  in_progress: { label: "Corriendo", tone: "aviso" },
  unknown: { label: "Sin datos", tone: "neutro" },
};

const BUCKETS: { bucket: Bucket; title: string; tone: Tone; bar: string }[] = [
  { bucket: "Propuesta", title: "Falta confirmar", tone: "aviso", bar: "bg-aviso" },
  { bucket: "Decidido", title: "Decidido", tone: "ok", bar: "bg-ok" },
  { bucket: "Otro", title: "Otros estados", tone: "neutro", bar: "bg-suave" },
];

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

const relative = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function timeAgo(iso: string | null): string {
  if (!iso) return "sin fecha";
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  if (Number.isNaN(seconds)) return "sin fecha";
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "recién";
}

// Statuses come as free text ("Decidido*", "Propuesta. Kaina indicó…", "Decidido (Golazo, …)").
function bucketOf(status: string): Bucket {
  if (status.startsWith("Propuesta")) return "Propuesta";
  if (status.startsWith("Decidido")) return "Decidido";
  return "Otro";
}

function pillLabel(status: string): string {
  const bucket = bucketOf(status);
  if (bucket === "Otro") return status.split(/[.(]/)[0].trim();
  return status.startsWith("Decidido*") ? "Decidido*" : bucket;
}

async function fetchStatus(): Promise<RepoStatus | null> {
  try {
    return await apiGet<RepoStatus>("/repo-status");
  } catch {
    return null;
  }
}

export default async function EstadoPage() {
  const data = await fetchStatus();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-linea pb-6">
        <div>
          <Eyebrow>Comité · team-45</Eyebrow>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Estado del proyecto</h1>
        </div>
        {data && (
          <p className="text-sm text-suave">
            Actualizado {timeAgo(data.fetched_at)} ·{" "}
            <a href={data.repo_url} className="font-medium text-primario underline-offset-4 hover:underline">
              Ver el repo
            </a>
          </p>
        )}
      </header>
      {data ? <Dashboard data={data} /> : <Unreachable />}
    </main>
  );
}

function Unreachable() {
  return (
    <Card className="mt-8 max-w-xl">
      <h2 className="text-lg font-semibold">No pudimos traer el estado</h2>
      <p className="mt-2 text-sm text-suave">
        La API no respondió. Puede que se esté reiniciando: prueba recargar en un minuto.
      </p>
    </Card>
  );
}

function Dashboard({ data }: { data: RepoStatus }) {
  const allItems = [...data.product_items, ...data.engineering_items];
  return (
    <>
      {data.errors.length > 0 && (
        <p role="status" className="mt-6 rounded-2xl bg-aviso-claro px-4 py-3 text-sm text-aviso">
          Parte de la información no se pudo cargar: {data.errors.join(" · ")}
        </p>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Summary items={allItems} />
          <ItemSection title="Producto" hint="Decisiones (D-) y límites (L-)" items={data.product_items} />
          <ItemSection title="Ingeniería" hint="Cómo se construye (E-)" items={data.engineering_items} />
        </div>
        <aside className="space-y-6">
          <CiCard ci={data.ci} />
          <Commits commits={data.commits} />
        </aside>
      </div>
    </>
  );
}

/** Signature piece: one bar that shows how much of the plan is settled vs still pending. */
function Summary({ items }: { items: Item[] }) {
  const counts = BUCKETS.map((b) => ({ ...b, count: items.filter((i) => bucketOf(i.status) === b.bucket).length }));
  const pending = counts[0].count;
  return (
    <Card>
      <p className="text-xl font-medium leading-snug sm:text-2xl">
        {pending === 0
          ? "No queda nada por confirmar."
          : `${pending} de ${items.length} ${items.length === 1 ? "ítem espera" : "ítems esperan"} que un humano lo${pending === 1 ? "" : "s"} confirme.`}
      </p>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-fondo" aria-hidden>
        {counts.map((c) =>
          c.count ? <div key={c.bucket} className={c.bar} style={{ flexGrow: c.count }} /> : null,
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-suave">
        {counts.map((c) => (
          <li key={c.bucket} className="flex items-center gap-2">
            <span aria-hidden className={`size-2 rounded-full ${c.bar}`} />
            {c.title}: <span className="font-semibold tabular-nums text-tinta">{c.count}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ItemSection({ title, hint, items }: { title: string; hint: string; items: Item[] }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-suave">{hint}</span>
      </div>
      {items.length === 0 && <p className="mt-3 text-sm text-suave">Todavía no hay ítems.</p>}
      {BUCKETS.map(({ bucket, title: groupTitle }) => {
        const group = items.filter((i) => bucketOf(i.status) === bucket);
        if (group.length === 0) return null;
        return (
          <div key={bucket} className="mt-5">
            <Eyebrow>
              {groupTitle} · {group.length}
            </Eyebrow>
            <ul className="mt-2 divide-y divide-linea">
              {group.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </ul>
          </div>
        );
      })}
    </Card>
  );
}

function ItemRow({ item }: { item: Item }) {
  const bucket = bucketOf(item.status);
  const label = pillLabel(item.status);
  const tone = BUCKETS.find((b) => b.bucket === bucket)!.tone;
  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]">
      <span className="font-mono text-xs font-semibold leading-6 text-suave">{item.id}</span>
      <div className="text-sm leading-6">
        {item.summary}
        {label !== item.status && <span className="block text-xs text-suave">{item.status}</span>}
      </div>
      <span className="col-start-2 sm:col-start-3">
        <Pill tone={tone}>{label}</Pill>
      </span>
    </li>
  );
}

function CiCard({ ci }: { ci: RepoStatus["ci"] }) {
  const { label, tone } = CI_LABELS[ci.status] ?? CI_LABELS.unknown;
  const body: ReactNode = (
    <>
      <Pill tone={tone}>{label}</Pill>
      <span className="text-xs text-suave">
        {ci.commit_sha ? <span className="font-mono">{ci.commit_sha.slice(0, 7)}</span> : "sin commit"} ·{" "}
        {timeAgo(ci.updated_at)}
      </span>
    </>
  );
  return (
    <Card>
      <h2 className="text-lg font-semibold">Integración continua</h2>
      <p className="mt-1 text-sm text-suave">Los tests y el build del último cambio en main.</p>
      {ci.url ? (
        <a
          data-testid="ci-status"
          href={ci.url}
          className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-fondo px-4 py-3 hover:bg-primario-claro focus-visible:outline-2 focus-visible:outline-primario"
        >
          {body}
          <span className="ml-auto text-xs font-medium text-primario">Ver ejecución →</span>
        </a>
      ) : (
        <div data-testid="ci-status" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-fondo px-4 py-3">
          {body}
        </div>
      )}
    </Card>
  );
}

function Commits({ commits }: { commits: Commit[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Últimos cambios</h2>
      {commits.length === 0 && <p className="mt-3 text-sm text-suave">No hay commits para mostrar.</p>}
      <ol className="mt-3 divide-y divide-linea">
        {commits.map((commit) => (
          <li key={commit.sha}>
            <a href={commit.url} className="group block py-2.5">
              <span className="block text-sm leading-snug group-hover:text-primario">{commit.message.split("\n")[0]}</span>
              <span className="mt-0.5 block text-xs text-suave">
                {commit.author} · {timeAgo(commit.date)} · <span className="font-mono">{commit.sha.slice(0, 7)}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Card>
  );
}
