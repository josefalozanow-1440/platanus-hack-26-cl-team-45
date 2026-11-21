"use client";

import { useState, useTransition } from "react";

import { BUTTON } from "@/components/ui";

import { savePrivacy } from "../actions";
import type { PrivacySettings } from "../types";

type Props = { comiteName: string; epName: string; initial: PrivacySettings };

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-primario" : "bg-linea"}`}
    >
      <span className={`absolute top-1 size-5 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

export function PrivacyForm({ comiteName, epName, initial }: Props) {
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const rows: { key: keyof PrivacySettings; title: string; body: string; note?: string }[] = [
    { key: "shares_with_comite", title: comiteName, body: "Ve si cada documento está listo, falta o vence. No ve el contenido." },
    {
      key: "shares_with_ep",
      title: epName,
      body: "Ve tus documentos: es quien los presenta al SERVIU.",
      note: "Necesario para postular",
    },
    {
      key: "shares_sensitive",
      title: "Datos sensibles",
      body: "Discapacidad u otras condiciones. Suman puntaje al grupo si los compartes.",
    },
  ];

  function update(key: keyof PrivacySettings, value: boolean) {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  }

  function save() {
    startTransition(async () => {
      await savePrivacy(settings);
      setSaved(true);
    });
  }

  return (
    <>
      <ul className="mt-4 divide-y divide-linea rounded-3xl bg-white px-5">
        {rows.map((row) => (
          <li key={row.key} className="flex items-start gap-3 py-4">
            <div className="flex-1">
              <h3 className="font-semibold">{row.title}</h3>
              <p className="mt-0.5 text-sm text-suave">{row.body}</p>
              {row.note && <p className="mt-1 font-mono text-[11px] text-primario">{row.note}</p>}
            </div>
            <Toggle label={row.title} checked={settings[row.key]} onChange={(value) => update(row.key, value)} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={save}
        disabled={pending}
        className={`mt-4 disabled:opacity-60 ${BUTTON.primary}`}
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
      <p role="status" className="mt-2 min-h-4 text-center text-xs text-ok">
        {saved && "Listo, guardamos tus preferencias."}
      </p>
      <p className="mt-2 text-xs text-suave">
        Ley 21.719 de protección de datos personales. Puedes cambiar esto cuando quieras.
      </p>
    </>
  );
}
