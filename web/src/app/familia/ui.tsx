import Link from "next/link";
import type { ReactNode } from "react";

import type { Tone } from "@/components/ui";

import type { DocumentStatus, Person } from "./types";

export const DOC_TONES: Record<DocumentStatus, Tone> = { listo: "ok", falta: "alerta", vence: "aviso", no_aplica: "neutro" };

export function ScreenTitle({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <header className="mb-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-suave">{eyebrow}</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">{children}</h1>
    </header>
  );
}

export function Avatars({ people, className = "bg-alerta-claro" }: { people: Person[]; className?: string }) {
  return (
    <div className="flex -space-x-1.5">
      {people.map((person) => (
        <span
          key={person.name}
          title={person.name}
          className={`inline-flex size-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${className}`}
        >
          {person.initials}
        </span>
      ))}
    </div>
  );
}

const TABS = [
  { href: "/familia/carpeta", label: "Carpeta" },
  { href: "/familia/grupo", label: "Grupo" },
  { href: "/familia/firma", label: "Te toca" },
];

/** Bottom navigation of the family app, as in F2 and F3. */
export function FamilyNav({ current }: { current: string }) {
  return (
    <nav className="sticky bottom-4 mt-6 flex items-center gap-2">
      <div className="flex flex-1 rounded-full bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={tab.href === current ? "page" : undefined}
            className={`flex-1 rounded-full py-2 text-center text-xs ${tab.href === current ? "bg-primario-claro font-medium text-primario" : "text-suave"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Link href="/familia/chat" className="flex items-center gap-2 rounded-full bg-primario px-4 py-2.5 text-sm font-medium text-white">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-white text-[10px] font-bold text-primario">C</span>
        Copiloto
      </Link>
    </nav>
  );
}
