"use client";

import { useTransition } from "react";

import { signDj49, undoSignature } from "../actions";

// shortcut: there is no ClaveÚnica integration yet; the button records the signature directly.
export function SignButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signDj49())}
      className="mt-4 w-full rounded-2xl bg-primario py-3 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? "Conectando con ClaveÚnica…" : "Firmar con ClaveÚnica"}
    </button>
  );
}

/** Demo only: lets the presenter show the signature again. */
export function UndoButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => undoSignature())}
      className="mt-2 w-full py-2 text-xs text-suave underline"
    >
      Deshacer firma (demo)
    </button>
  );
}
