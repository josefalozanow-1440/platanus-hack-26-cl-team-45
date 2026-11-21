// E5b · Reglas aplicadas. Static shell: the data lives in ./data.
import Link from "next/link";

import { Cite, FolioMark } from "@/components/folio";
import { Card, Initials, NowBanner, Pill } from "@/components/ui";

import { ACTION, Actions, Title } from "../../ui";
import { AFFECTED, BANNER, FOLIO_DID, STEPS } from "./data";

export default function AppliedRulesPage() {
  return (
    <>
      <NowBanner>{BANNER}</NowBanner>
      <Title title="Así queda el camino del grupo">
        Plazos recalculados con las reglas del llamado. Los que cambiaron están en amarillo.
      </Title>
      <ol aria-label="Camino del grupo" className="grid gap-2 rounded-3xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className={`flex flex-col items-start gap-1.5 rounded-2xl p-3.5 ${step.before ? "bg-aviso-claro" : "bg-fondo"}`}>
            <span className="font-mono text-[11px] text-suave">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm font-semibold">{step.title}</span>
            <span className="text-sm">{step.value}</span>
            {step.before && <span className="font-mono text-[11px] text-aviso">{step.before}</span>}
            <Cite>{step.cite}</Cite>
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 font-semibold">
            <FolioMark />
            Lo que hizo Folio
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm">
            {FOLIO_DID.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${item.dot}`} />
                {item.text}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold">A quién le cambia algo</h2>
          <ul className="mt-3 flex flex-col gap-3 text-sm">
            {AFFECTED.map((item) => (
              <li key={item.badge} className="flex items-center gap-3">
                <Initials tone={item.badgeTone} size="size-8">
                  {item.badge}
                </Initials>
                <span className="flex-1">{item.text}</span>
                <Pill tone={item.pillTone}>{item.pill}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Actions>
        <Link href="/autogestionado/llamado" className={ACTION.secondary}>
          Ver reglas
        </Link>
        {/* No carpetas screen for the comité autogestionado yet. */}
        <button type="button" className={ACTION.primary}>
          Ir a las carpetas
        </button>
      </Actions>
    </>
  );
}
