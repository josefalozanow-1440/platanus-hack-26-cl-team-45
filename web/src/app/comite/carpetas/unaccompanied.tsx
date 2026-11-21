"use client";

import { useActionState } from "react";

import { Badge, Card, initials } from "@/components/ui";

import { accompany, remind } from "../actions";
import type { MissingFolder, ReminderSent } from "../types";

const BUTTON = "flex-1 rounded-2xl px-4 py-3 text-base font-semibold disabled:opacity-60";

/** "Familia Pérez no tiene acompañante": someone from the directiva takes it, or the copilot reminds it. */
export function Unaccompanied({ family }: { family: MissingFolder }) {
  const [reminder, sendReminder, reminding] = useActionState<ReminderSent | null>(() => remind(family.id), null);
  const [, takeFamily, taking] = useActionState<null>(async () => {
    await accompany(family.id);
    return null;
  }, null);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Badge className="bg-aviso-claro text-tinta">{initials(family.name)}</Badge>
        <div>
          <p className="font-semibold">{family.name} no tiene acompañante</p>
          <p className="text-sm text-suave">{family.missing_label}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <form action={takeFamily} className="flex flex-1">
          <button type="submit" disabled={taking} className={`${BUTTON} bg-primario text-white`}>
            Acompañar yo
          </button>
        </form>
        <form action={sendReminder} className="flex flex-1">
          <button type="submit" disabled={reminding} className={`${BUTTON} border border-linea bg-white text-tinta`}>
            Recordar
          </button>
        </form>
      </div>
      {reminder && (
        <p role="status" className="text-sm text-suave">
          {reminder.sent
            ? `El copiloto le recordó a la ${reminder.family} lo que le falta.`
            : `Ya le recordamos hoy a la ${reminder.family}. Insistir no lo apura.`}
        </p>
      )}
    </Card>
  );
}
