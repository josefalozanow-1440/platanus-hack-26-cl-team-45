import { Badge, Card, Pill, toneClasses, type Tone } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { ComiteCarpetas, MissingFolder } from "../types";
import { Callout, DEMO_COMITE, ErrorScreen, FolderCard, Screen, SectionTitle, formatDate } from "../ui";
import { Unaccompanied } from "./unaccompanied";

export const dynamic = "force-dynamic";

// Families without a companion are yellow; the rest rotate like in the Figma.
const ACCOMPANIED_TONES: Tone[] = ["ok", "info", "alerta"];
// Colored squares that stand for the ready carpetas, as in the Figma.
const READY_PREVIEW: Tone[] = ["ok", "info", "alerta", "aviso", "ok", "info", "aviso"];

function Stat({ value, label, tone }: { value: number; label: string; tone: Tone }) {
  return (
    <div className={`flex-1 rounded-3xl p-4 ${toneClasses(tone)}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function companionTab(folder: MissingFolder): string {
  return folder.companion_name ? `${folder.companion_name} la acompaña` : "Sin acompañante";
}

export default async function CarpetasPage() {
  let page: ComiteCarpetas;
  try {
    page = await apiGet<ComiteCarpetas>(`/comite/${DEMO_COMITE}/carpetas`);
  } catch {
    return <ErrorScreen />;
  }
  const { counts, composition, savings_cutoff: cutoff } = page;
  const needHelp = counts.missing + counts.expiring;
  const unaccompanied = page.missing.find((folder) => folder.companion_name === null);
  const shownReady = Math.min(READY_PREVIEW.length, counts.complete);

  return (
    <Screen eyebrow={`Directiva · ${page.name}`} title="Carpetas del grupo">
      <div className="flex gap-3" data-testid="counts">
        <Stat value={counts.complete} label="listas" tone="ok" />
        <Stat value={counts.missing} label="con faltantes" tone="alerta" />
        <Stat value={counts.expiring} label="por vencer" tone="aviso" />
      </div>

      <Card className="flex items-center gap-3 !p-4">
        <Badge className="bg-primario text-white">C</Badge>
        <div>
          <p className="font-semibold">Copiloto revisó las {counts.total} carpetas hoy</p>
          <p className="text-sm text-suave">
            {needHelp} {needHelp === 1 ? "familia necesita" : "familias necesitan"} algo · ya les avisó
          </p>
        </div>
      </Card>

      {cutoff && (
        <Callout
          tone="aviso"
          label={`Corte del ahorro en ${cutoff.deadline.remaining_days} días · ${formatDate(cutoff.deadline.due_on).slice(0, 5)}`}
        >
          {cutoff.below_minimum} {cutoff.below_minimum === 1 ? "familia aún no llega" : "familias aún no llegan"} a 10 UF.
        </Callout>
      )}

      <Card className="flex items-start justify-between gap-3 !p-4">
        <div>
          <p className="font-semibold">Composición del grupo</p>
          <p className="text-sm text-suave">
            {composition.in_rsh_40} de {composition.total} familias ({composition.share_percent}%) en el 40% más
            vulnerable. Máximo 30% sobre el 40% (art. 1).
          </p>
        </div>
        <Pill tone={composition.compliant ? "ok" : "alerta"}>{composition.compliant ? "Cumple" : "No cumple"}</Pill>
      </Card>

      <SectionTitle title="Con faltantes" badge={<Pill tone="alerta">{counts.missing}</Pill>} />
      <div className="flex flex-col" data-testid="missing">
        {page.missing.map((folder, index) => (
          <FolderCard
            key={folder.id}
            tone={folder.companion_name ? ACCOMPANIED_TONES[index % ACCOMPANIED_TONES.length] : "aviso"}
            tab={companionTab(folder)}
            name={folder.name}
            detail={folder.missing_label}
            badge={`${folder.done} / ${folder.total}`}
          />
        ))}
      </div>
      {page.hidden > 0 && (
        <p className="text-sm text-suave">
          {page.hidden} {page.hidden === 1 ? "familia con faltantes no comparte" : "familias con faltantes no comparten"} su
          carpeta con el comité.
        </p>
      )}

      {unaccompanied && <Unaccompanied family={unaccompanied} />}

      <SectionTitle title="Listas" badge={<Pill tone="ok">{counts.complete}</Pill>} />
      <div className="flex items-center gap-1">
        {READY_PREVIEW.slice(0, shownReady).map((tone, index) => (
          <span key={index} aria-hidden className={`h-7 w-9 rounded-lg border-2 border-fondo ${toneClasses(tone)}`} />
        ))}
        {counts.complete > shownReady && (
          <span className="ml-1 text-sm text-suave">+{counts.complete - shownReady} familias</span>
        )}
      </div>

      <p className="text-sm text-suave">Ves el estado de cada carpeta, no su contenido. Cada familia lo autorizó.</p>
    </Screen>
  );
}
