// F5 · Pedro · Firma lista
import Link from "next/link";

import { BUTTON, Card, Eyebrow, FolderCard, Initials } from "@/components/ui";

import { CHANGES, SIGNED } from "./data";

export default function FirmaListaPage() {
  return (
    <main className="space-y-4">
      <Eyebrow>{SIGNED.signerName}</Eyebrow>

      <section className="rounded-3xl bg-ok-claro px-5 py-7 text-center">
        <span aria-hidden className="mx-auto flex size-16 items-center justify-center rounded-full bg-ok text-2xl text-white">
          ✓
        </span>
        <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight">Listo, firmaste</h1>
        <p className="mt-3 text-sm text-suave">
          Tu firma quedó en la carpeta de tu familia. ClaveÚnica confirmó tu identidad a las {SIGNED.confirmedAt}.
        </p>
      </section>

      <div>
        <FolderCard tone="alerta" tab={SIGNED.comiteName} name={SIGNED.familyName} detail={SIGNED.detail} badge={SIGNED.progress} />
      </div>

      <Card>
        <Eyebrow>Lo que cambió con tu firma</Eyebrow>
        <ul className="mt-3 space-y-4">
          {CHANGES.map((change) => (
            <li key={change.initials} className="flex items-start gap-3 text-[15px]">
              <Initials tone={change.tone}>{change.initials}</Initials>
              {change.text}
            </li>
          ))}
        </ul>
      </Card>

      <Link href="/familia/grupo" className={BUTTON.primary}>
        Ver cómo va el grupo
      </Link>
      <Link href="/familia/carpeta" className={BUTTON.secondary}>
        Cerrar
      </Link>
    </main>
  );
}
