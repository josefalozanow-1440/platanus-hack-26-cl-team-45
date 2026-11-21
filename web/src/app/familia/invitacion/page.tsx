// I2 · Pedro · Abre la invitación
import Link from "next/link";

import { BUTTON, Card, Eyebrow, FolderCard, Initials } from "@/components/ui";

import { INVITATION } from "./data";

export default function InvitacionPage() {
  return (
    <main className="flex flex-col gap-4">
      <Eyebrow>Invitación</Eyebrow>

      <Card className="!p-6">
        <div className="flex -space-x-2">
          <Initials size="size-12 !rounded-2xl !text-base">{INVITATION.inviterInitials}</Initials>
          <Initials tone="info" size="size-12 !rounded-2xl !text-base ring-2 ring-white">
            F
          </Initials>
        </div>
        <h1 className="mt-5 text-[26px] leading-tight font-semibold tracking-tight">
          {INVITATION.inviter} te invitó a la carpeta de tu familia
        </h1>
        <p className="mt-3 text-[15px] text-suave">{INVITATION.subtitle}</p>
      </Card>

      <FolderCard
        tone="alerta"
        tab={INVITATION.comite}
        name={INVITATION.family}
        detail={INVITATION.detail}
        badge={INVITATION.progress}
      />

      <Card>
        <label htmlFor="guest-name" className="text-[15px] font-medium">
          ¿Cómo te llamas?
        </label>
        {/* The name is not sent anywhere yet: ClaveÚnica confirms the identity in the next screen. */}
        <input
          id="guest-name"
          name="name"
          defaultValue={INVITATION.guestName}
          className="mt-3 w-full rounded-2xl border-2 border-primario bg-fondo px-4 py-3.5 text-lg outline-none"
        />
        <p className="mt-3 text-xs text-suave">No necesitas crear una cuenta. Tu identidad la confirma ClaveÚnica al firmar.</p>
      </Card>

      <Link href="/familia/firma" className={BUTTON.primary}>
        Continuar y firmar con ClaveÚnica
      </Link>
      <p className="text-center font-mono text-xs text-suave">Toma menos de 2 minutos</p>
    </main>
  );
}
