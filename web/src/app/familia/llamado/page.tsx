// F6 · Familia · Cambió el llamado (shell with fixed data)
import Link from "next/link";

import { Cite, FolioCard, FolioFooter } from "@/components/folio";
import { BUTTON, Callout, Card, Folder, Pill } from "@/components/ui";

import { FamilyNav, ScreenTitle } from "../ui";
import { LLAMADO } from "./data";

export default function LlamadoPage() {
  const { change, carpeta } = LLAMADO;
  return (
    <main className="space-y-3">
      <ScreenTitle eyebrow={`${LLAMADO.family} · ${LLAMADO.comite}`}>Cambiaron las reglas de tu postulación</ScreenTitle>

      <FolioCard className="!border-transparent">
        <p className="text-[15px]">{LLAMADO.intro}</p>
      </FolioCard>

      <FolioCard label="Cambio">
        <p className="text-[28px] font-semibold leading-tight text-primario">{change.amount}</p>
        <p className="mt-2 text-sm">{change.body}</p>
        <FolioFooter note={change.missing}>
          <Cite>{change.source}</Cite>
        </FolioFooter>
      </FolioCard>

      <Callout tone="aviso" label="Para todo el grupo">
        <p className="text-sm">{LLAMADO.group}</p>
      </Callout>

      <Card className="flex items-center gap-4 !p-4">
        <Folder tone="aviso" className="w-20" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Tu carpeta</h2>
          <p className="text-xs text-suave">{carpeta.detail}</p>
        </div>
        <Pill tone="aviso">{carpeta.pending}</Pill>
      </Card>

      <Link href="/familia/chat" className={BUTTON.primary}>
        Cómo completar mi ahorro
      </Link>

      <FamilyNav current="/familia/carpeta" />
    </main>
  );
}
