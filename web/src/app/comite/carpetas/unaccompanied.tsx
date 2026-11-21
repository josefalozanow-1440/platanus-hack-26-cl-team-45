"use client";

import { useActionState } from "react";

import { BUTTON, Card, Initials, initials } from "@/components/ui";

import { accompany, remind } from "../actions";
import type { MissingFolder, ReminderSent } from "../types";

/** "Familia Pérez no tiene acompañante": someone from the directiva takes it, or Folio reminds it. */
export function Unaccompanied({ family, live }: { family: MissingFolder; live: boolean }) {
  const [reminder, sendReminder, reminding] = useActionState<ReminderSent | null>(() => remind(family.id), null);
  const [, takeFamily, taking] = useActionState<null>(async () => {
    await accompany(family.id);
    return null;
  }, null);
  // On the fixed screen (C1b) the buttons do nothing.
  const type = live ? "submit" : "button";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Initials tone="aviso">{initials(family.name)}</Initials>
        <div>
          <p className="text-[15px] font-semibold">{family.name} no tiene acompañante</p>
          <p className="text-xs text-suave">{family.missing_label}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <form action={takeFamily} className="flex-1">
          <button type={type} disabled={taking} className={`${BUTTON.primary} disabled:opacity-60`}>
            Acompañar yo
          </button>
        </form>
        <form action={sendReminder} className="flex-1">
          <button type={type} disabled={reminding} className={`${BUTTON.secondary} disabled:opacity-60`}>
            Recordar
          </button>
        </form>
      </div>
      {reminder && (
        <p role="status" className="text-sm text-suave">
          {reminder.sent
            ? `Folio le recordó a la ${reminder.family} lo que le falta.`
            : `Ya le recordamos hoy a la ${reminder.family}. Insistir no lo apura.`}
        </p>
      )}
    </Card>
  );
}
