// E5 · Folio leyó el llamado. Static shell: the data lives in ./data.
import Link from "next/link";

import { Cite, FolioMark } from "@/components/folio";
import { Eyebrow, Pill } from "@/components/ui";

import { ACTION, Actions, Title } from "../ui";
import { CALL, KINDS, RULE_GROUPS, SCAN_LINES, type Rule } from "./data";

const SMALL = "rounded-lg px-3 py-1.5 text-xs font-semibold";

function RuleRow({ rule }: { rule: Rule }) {
  const kind = KINDS[rule.kind];
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-linea px-4 py-3 first:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {rule.title}
          <Pill tone={kind.tone}>{kind.label}</Pill>
        </p>
        <p className="mt-1 text-sm">{rule.value}</p>
        <p className="mt-1 flex items-center gap-2 text-xs text-suave">
          {rule.base}
          <Cite>{rule.cite}</Cite>
        </p>
      </div>
      <button type="button" className={`${SMALL} bg-primario text-white`}>
        Aceptar
      </button>
      <button type="button" className={`${SMALL} border border-linea bg-white`}>
        Editar
      </button>
    </li>
  );
}

/** Drawing of the scanned page: grey lines, and in yellow the ones Folio used. */
function ScannedPage() {
  return (
    <section aria-label="Página escaneada" className="w-full shrink-0 rounded-3xl bg-white p-4 lg:w-80">
      <p className="flex justify-between text-xs font-semibold">
        {CALL.page}
        <span className="font-mono text-[10px] font-normal text-suave">OCR</span>
      </p>
      <div aria-hidden className="mt-3 flex flex-col gap-2 rounded-xl bg-fondo p-4">
        {SCAN_LINES.map((line, index) => (
          <div key={index} className="relative h-1.5">
            <div className={`h-full rounded-full ${line.mark ? "bg-amarillo" : "bg-linea"}`} style={{ width: `${line.width}%` }} />
            {line.mark && (
              <span className="absolute -top-1 right-0 rounded bg-tinta px-1 font-mono text-[9px] leading-[14px] text-white">{line.mark}</span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-suave">{CALL.caption}</p>
    </section>
  );
}

export default function CallPage() {
  return (
    <>
      <p className="text-xs text-suave">
        Las Araucarias
        <span aria-hidden className="mx-2">
          /
        </span>
        <span className="font-medium text-tinta">Llamado</span>
      </p>
      <Title title="Folio leyó el llamado">{CALL.subtitle}</Title>
      <p className="flex items-start gap-3 rounded-2xl bg-primario-claro px-4 py-3 text-sm text-primario">
        <FolioMark />
        {CALL.summary}
      </p>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <ScannedPage />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          {RULE_GROUPS.map((group) => (
            <section key={group.title} aria-label={group.title} className="flex flex-col gap-2">
              <Eyebrow>{group.title}</Eyebrow>
              <ul className="rounded-3xl bg-white">
                {group.rules.map((rule) => (
                  <RuleRow key={rule.title} rule={rule} />
                ))}
              </ul>
            </section>
          ))}
          <Actions>
            <button type="button" className={ACTION.secondary}>
              Revisar después
            </button>
            <Link href="/autogestionado/llamado/aplicadas" className={ACTION.primary}>
              {CALL.apply}
            </Link>
          </Actions>
        </div>
      </div>
    </>
  );
}
