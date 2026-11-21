// A1 · Comité · Asamblea
import { Card, Initials, Pill } from "@/components/ui";
import { FolioNote } from "@/components/folio";

import { Screen } from "../ui";
import { ASSEMBLY, RESULTS } from "./data";
import { VoteOptions } from "./vote";

function Bar({ percent, color, marker }: { percent: number; color: string; marker?: number }) {
  return (
    <div className="relative mt-2 h-2 rounded-full bg-fondo">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      {marker !== undefined && <span aria-hidden className="absolute -top-1 h-4 w-0.5 bg-tinta" style={{ left: `${marker}%` }} />}
    </div>
  );
}

export default function AsambleaPage() {
  const { voted, total, minPercent, minFamilies } = ASSEMBLY.participation;
  return (
    <Screen eyebrow={ASSEMBLY.eyebrow} title={ASSEMBLY.title}>
      <Card>
        <p className="flex items-center gap-2 text-xs text-suave">
          <Initials tone="aviso" size="size-7 !rounded-lg !text-[10px]">
            {ASSEMBLY.proposer.initials}
          </Initials>
          {ASSEMBLY.proposer.line}
        </p>
        <p className="mt-3 text-[15px]">{ASSEMBLY.proposal}</p>
        {/* No action yet: there are no plans to show. */}
        <button type="button" className="mt-3 text-sm font-semibold text-primario">
          {ASSEMBLY.plansLabel}
        </button>
      </Card>

      {/* Renders as fragments of the page flow: the confirm button goes last with CSS order. */}
      <div className="contents [&>fieldset]:contents">
        <VoteOptions options={ASSEMBLY.options} note={ASSEMBLY.voteNote} />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Participación</h2>
          <Pill tone="ok">Quórum alcanzado</Pill>
        </div>
        <Bar percent={(voted / total) * 100} color="bg-primario" marker={minPercent} />
        <p className="mt-2 flex justify-between font-mono text-xs">
          <span>
            {voted} de {total} familias
          </span>
          <span className="text-suave">
            mínimo {minPercent}% · {minFamilies}
          </span>
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold">Resultados hasta ahora</h2>
        <ul className="mt-3 space-y-3">
          {RESULTS.map((result) => (
            <li key={result.label}>
              <p className="flex items-center gap-2 text-[15px]">
                <span className="flex-1">{result.label}</span>
                <span className="flex -space-x-1">
                  {result.voters.map((voter) => (
                    <Initials key={voter.initials} tone={voter.tone} size="size-5 !rounded-md !text-[8px] ring-1 ring-white">
                      {voter.initials}
                    </Initials>
                  ))}
                </span>
                <span className="w-6 text-right font-medium">{result.count}</span>
              </p>
              <Bar percent={(result.count / voted) * 100} color={result.bar} />
            </li>
          ))}
        </ul>
      </Card>

      <FolioNote>{ASSEMBLY.folioNote}</FolioNote>
    </Screen>
  );
}
