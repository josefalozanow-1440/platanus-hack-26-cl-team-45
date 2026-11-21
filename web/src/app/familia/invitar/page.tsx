// I1 · Marta · Invitar a firmar
import { BUTTON, Card, Eyebrow, Initials } from "@/components/ui";

import { ScreenTitle } from "../ui";
import { INVITE } from "./data";
import { QrCode } from "./qr";

export default function InvitarPage() {
  return (
    <main className="flex flex-col gap-4">
      <ScreenTitle eyebrow="Invitar a tu familia">Pedro necesita firmar</ScreenTitle>

      <Card className="-mt-1">
        <div className="flex items-center gap-3">
          <Initials size="size-12 !rounded-2xl !text-base">{INVITE.initials}</Initials>
          <div>
            <h2 className="text-lg leading-tight font-semibold">{INVITE.name}</h2>
            <p className="text-sm text-suave">{INVITE.detail}</p>
          </div>
        </div>
        <p className="mt-3 text-[15px] text-suave">{INVITE.reason}</p>
      </Card>

      <Card className="flex flex-col items-center">
        <h2 className="font-semibold">Que Pedro escanee este código</h2>
        <QrCode className="mt-3 w-56" />
        <p className="mt-4 flex w-full items-center justify-between rounded-2xl bg-fondo py-1.5 pr-1.5 pl-4">
          <span className="font-mono text-sm">{INVITE.link}</span>
          {/* No action yet: copying the link comes with real invitations. */}
          <button type="button" className="rounded-xl bg-primario-claro px-3 py-1.5 text-xs font-semibold text-primario">
            Copiar
          </button>
        </p>
        <p className="mt-3 w-full text-xs text-suave">{INVITE.expiry}</p>
      </Card>

      {/* No action yet: sending by WhatsApp or SMS is out of this shell. */}
      <button type="button" className={BUTTON.primary}>
        Enviar por WhatsApp
      </button>
      <button type="button" className={BUTTON.secondary}>
        Enviar por SMS
      </button>

      <section className="rounded-3xl bg-primario-claro p-5">
        <Eyebrow className="!text-primario">Estado de la invitación</Eyebrow>
        <ol className="mt-2 space-y-2 text-[15px]">
          {INVITE.steps.map((step) => (
            <li key={step.label} className={`flex items-center gap-3 ${step.done ? "" : "text-suave"}`}>
              <span aria-hidden className={`size-2.5 rounded-full ${step.done ? "bg-ok" : "bg-linea"}`} />
              {step.label}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
