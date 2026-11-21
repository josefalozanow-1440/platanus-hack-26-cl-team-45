import type { ReactNode } from "react";

import { Card, Pill, Stat, toneClasses, type Tone } from "@/components/ui";
import { FolioMark } from "@/components/folio";

import type { ComiteCarpetas, MissingFolder } from "../types";
import { Callout, FolderCard, Screen, SectionTitle, formatDate } from "../ui";
import { Unaccompanied } from "./unaccompanied";

// Families without a companion are yellow; the rest rotate like in the Figma.
const ACCOMPANIED_TONES: Tone[] = ["ok", "info", "alerta"];
// Colored squares that stand for the ready carpetas, as in the Figma.
const READY_PREVIEW: Tone[] = ["ok", "neutro", "info", "alerta", "aviso", "ok", "neutro"];

function Folders({ folders, tone }: { folders: MissingFolder[]; tone?: Tone }) {
  let accompanied = 0;
  return folders.map((folder) => (
    <FolderCard
      key={folder.id}
      tone={tone ?? (folder.companion_name ? ACCOMPANIED_TONES[accompanied++ % ACCOMPANIED_TONES.length] : "aviso")}
      tab={folder.companion_name ? `${folder.companion_name} la acompaña` : "Sin acompañante"}
      name={folder.name}
      detail={folder.missing_label}
      badge={`${folder.done} / ${folder.total}`}
    />
  ));
}

type Props = {
  page: ComiteCarpetas;
  /** Strip above the numbers with the latest event (C1b). */
  banner?: ReactNode;
  /** What Folio did last. Defaults to today's review of the carpetas. */
  folio?: { title: string; detail: string };
  /** Carpetas that only wait for the savings cutoff (C1b). */
  expiring?: MissingFolder[];
  /** false leaves "Acompañar yo" and "Recordar" without action (C1b is a fixed screen). */
  live?: boolean;
};

/** Body of C1 "Carpetas del grupo". C1 feeds it from the API and C1b with fixed data. */
export function CarpetasView({ page, banner, folio, expiring = [], live = true }: Props) {
  const { counts, savings_cutoff: cutoff } = page;
  const needHelp = counts.missing + counts.expiring;
  const unaccompanied = page.missing.find((folder) => folder.companion_name === null);
  const shownReady = Math.min(READY_PREVIEW.length, counts.complete);
  const folioLine = folio ?? {
    title: `Folio revisó las ${counts.total} carpetas hoy`,
    detail: `${needHelp} ${needHelp === 1 ? "familia necesita" : "familias necesitan"} algo · ya les avisó`,
  };

  return (
    <Screen eyebrow={`Directiva · ${page.name}`} title="Carpetas del grupo">
      {banner}

      <div className="flex gap-2" data-testid="counts">
        <Stat value={counts.complete} label="listas" tone="ok" />
        <Stat value={counts.missing} label="con faltantes" tone="alerta" />
        <Stat value={counts.expiring} label="por vencer" tone="aviso" />
      </div>

      <Card className="flex items-center gap-3 !rounded-2xl !p-4">
        <FolioMark className="size-8 text-sm" />
        <div>
          <p className="text-sm font-semibold">{folioLine.title}</p>
          <p className="text-xs text-suave">{folioLine.detail}</p>
        </div>
      </Card>

      {cutoff && (
        <Callout
          tone="aviso"
          label={`Corte del ahorro en ${cutoff.deadline.remaining_days} días · ${formatDate(cutoff.deadline.due_on).slice(0, 5)}`}
        >
          <p className="text-sm">
            {cutoff.below_minimum} {cutoff.below_minimum === 1 ? "familia aún no llega" : "familias aún no llegan"} a 10 UF.
          </p>
        </Callout>
      )}

      <SectionTitle title="Con faltantes" badge={<Pill tone="alerta">{counts.missing}</Pill>} />
      <div className="flex flex-col" data-testid="missing">
        <Folders folders={page.missing} />
      </div>
      {page.hidden > 0 && (
        <p className="text-xs text-suave">
          {page.hidden} {page.hidden === 1 ? "familia con faltantes no comparte" : "familias con faltantes no comparten"} su
          carpeta con el comité.
        </p>
      )}

      {unaccompanied && <Unaccompanied family={unaccompanied} live={live} />}

      {expiring.length > 0 && (
        <>
          <SectionTitle title="Por vencer" badge={<Pill tone="aviso">{counts.expiring}</Pill>} />
          <div className="flex flex-col" data-testid="expiring">
            <Folders folders={expiring} tone="aviso" />
          </div>
        </>
      )}

      <SectionTitle title="Listas" badge={<Pill tone="ok">{counts.complete}</Pill>} />
      <div className="flex items-center">
        {READY_PREVIEW.slice(0, shownReady).map((tone, index) => (
          <span key={index} aria-hidden className={`-ml-1 h-8 w-10 rounded-lg border-2 border-fondo first:ml-0 ${toneClasses(tone)} ${tone === "neutro" ? "!bg-linea" : ""}`} />
        ))}
        {counts.complete > shownReady && (
          <span className="ml-1 text-xs text-suave">+{counts.complete - shownReady} familias</span>
        )}
      </div>

      <p className="text-xs text-suave">Ves el estado de cada carpeta, no su contenido. Cada familia lo autorizó.</p>
    </Screen>
  );
}
