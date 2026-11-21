"use client";

import { useActionState } from "react";

import { requestReminders, type ReminderState } from "../../actions";

export function ReminderButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<ReminderState, FormData>(requestReminders, null);
  if (state) {
    return (
      <p role="status" className="rounded-3xl bg-ok-claro py-4 text-center text-sm font-semibold text-ok">
        Listo: le pedimos a Folio recordarle a {state.families} familias lo que les falta.
      </p>
    );
  }
  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-3xl border border-linea bg-white py-4 text-sm font-semibold hover:bg-primario-claro disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar recordatorio a las familias con faltantes"}
      </button>
    </form>
  );
}
