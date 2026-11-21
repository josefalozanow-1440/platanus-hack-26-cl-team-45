"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { BUTTON } from "@/components/ui";

import { signDj49, undoSignature } from "../actions";

// shortcut: there is no ClaveÚnica integration yet; the button records the signature directly.
export function SignButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function sign() {
    startTransition(async () => {
      await signDj49();
      router.push("/familia/firma/lista");
    });
  }

  return (
    <button type="button" disabled={pending} onClick={sign} className={`mt-4 disabled:opacity-60 ${BUTTON.primary}`}
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
