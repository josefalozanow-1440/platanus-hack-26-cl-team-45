import { Card, Eyebrow, Pill } from "@/components/ui";
import { apiGet } from "@/lib/api";

import { propose } from "../actions";
import type { ComiteReemplazo, WaitlistFamily } from "../types";
import { Avatar, Callout, DEMO_COMITE, ErrorScreen, FolderCard, Screen, SectionTitle, formatDate } from "../ui";

export const dynamic = "force-dynamic";

const LIMIT_PERCENT = 30;

function waitlistDetail(family: WaitlistFamily): string {
  const tier = family.in_rsh_40 ? "Tramo 40%" : "Sobre el 40%";
  // Status only, never the amount (L-06).
  return `${tier} · ahorro ${family.savings_ready ? "listo" : "incompleto"}`;
}

function effectText(effect: ComiteReemplazo["effect"]): string {
  const start = `Si entra una familia sobre el 40% del RSH, el grupo queda en ${effect.percent_if_above}%`;
  if (!effect.compliant_if_above) return `${start}: pasa el límite del 30% del art. 1.`;
  if (effect.percent_if_above === LIMIT_PERCENT) return `${start}: justo en el límite del art. 1.`;
  return `${start}: dentro del límite del 30% del art. 1.`;
}

function receivedOn(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return iso === today ? "hoy" : `el ${formatDate(iso)}`;
}

export default async function ReemplazoPage() {
  let page: ComiteReemplazo;
  try {
    page = await apiGet<ComiteReemplazo>(`/comite/${DEMO_COMITE}/reemplazo`);
  } catch {
    return <ErrorScreen />;
  }
  const { renunciation, deadline } = page;
  const candidate = page.waitlist.find((family) => family.can_enter);

  return (
    <Screen
      eyebrow="Directiva · Reemplazo"
      title={renunciation ? `${renunciation.name} renunció` : "Nadie ha renunciado"}
    >
      {renunciation && (
        <div>
          <Eyebrow className="px-4 pb-1">Renuncia</Eyebrow>
          <div className="flex items-center gap-4 rounded-3xl bg-white/70 p-4">
            <Avatar name={renunciation.name} className="bg-white text-suave" />
            <div className="min-w-0 flex-1">
              <p className="text-xl font-semibold text-suave">{renunciation.name}</p>
              <p className="text-sm text-suave">Carta de renuncia recibida{" "}
                <span className="whitespace-nowrap">{receivedOn(renunciation.renounced_on)}</span></p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 font-mono text-sm">Sale</span>
          </div>
        </div>
      )}

      {deadline && (
        <Callout tone="alerta" label="Último día para reemplazar">
          <p className="text-4xl font-bold text-alerta" data-testid="replace-deadline">
            {formatDate(deadline.due_on)}
          </p>
          <p className="mt-2 text-sm text-suave">
            {deadline.note?.replace(/\.$/, "")}
            {deadline.article && ` (${deadline.article})`}.
          </p>
        </Callout>
      )}

      <Card>
        <h2 className="font-semibold">Quien entre debe tener, al ingresar</h2>
        <ul className="mt-2 flex flex-col">
          {page.requirements.map((requirement) => (
            <li key={requirement.label} className="flex items-center justify-between gap-3 py-2 text-sm">
              {requirement.label}
              <Pill tone={requirement.key ? "alerta" : "ok"}>{requirement.key ? "Clave" : "Revisar"}</Pill>
            </li>
          ))}
        </ul>
      </Card>

      <Callout tone="aviso" label="Efecto en la composición">
        <p className="text-sm">{effectText(page.effect)}</p>
      </Callout>

      <SectionTitle title="Lista de espera" />
      <div className="flex flex-col" data-testid="waitlist">
        {page.waitlist.map((family) => (
          <FolderCard
            key={family.id}
            tone={family.can_enter ? "ok" : "info"}
            tab="Lista de espera"
            name={family.name}
            detail={waitlistDetail(family)}
            badge={family.proposed ? "Propuesta" : (family.blocker ?? "Puede entrar")}
          />
        ))}
        {page.waitlist.length === 0 && <p className="text-sm text-suave">No hay familias en lista de espera.</p>}
      </div>

      {candidate &&
        (candidate.proposed ? (
          <Callout tone="ok" label="Propuesta lista">
            <p role="status" className="text-sm">
              La {candidate.name} va a la próxima asamblea para reemplazar a la {renunciation?.name ?? "familia que salió"}.
            </p>
          </Callout>
        ) : (
          <form action={propose.bind(null, candidate.id)}>
            <button type="submit" className="w-full rounded-2xl bg-primario px-4 py-3 text-base font-semibold text-white">
              Proponer a {candidate.name} en asamblea
            </button>
          </form>
        ))}

      <p className="text-sm text-suave">
        El reemplazo se aprueba en asamblea según los estatutos. La entidad patrocinante lo ingresa al sistema.
      </p>
    </Screen>
  );
}
