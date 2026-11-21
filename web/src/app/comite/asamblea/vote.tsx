"use client";

import { useState } from "react";

import { BUTTON } from "@/components/ui";

// shortcut: the vote lives in local state only, save it when the API has assemblies.
export function VoteOptions({ options, note }: { options: string[]; note: string }) {
  const [choice, setChoice] = useState(options[0]);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="-mb-1 text-lg font-semibold">Tu voto</legend>
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-linea bg-white px-4 py-3.5 text-[15px] font-medium has-checked:border-2 has-checked:border-primario has-checked:bg-primario-claro has-checked:text-primario"
        >
          <input
            type="radio"
            name="vote"
            value={option}
            checked={choice === option}
            onChange={() => {
              setChoice(option);
              setConfirmed(false);
            }}
            className="size-5 accent-primario"
          />
          {option}
        </label>
      ))}
      <p className="text-xs text-suave">{note}</p>
      {confirmed && (
        <p role="status" className="rounded-2xl bg-ok-claro py-3 text-center text-sm font-medium text-ok">
          Tu voto quedó registrado: {choice}
        </p>
      )}
      <button type="button" onClick={() => setConfirmed(true)} className={`order-last ${BUTTON.primary}`}>
        Confirmar mi voto
      </button>
    </fieldset>
  );
}
