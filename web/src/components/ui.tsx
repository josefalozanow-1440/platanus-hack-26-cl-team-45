// Small shared UI pieces that follow the Figma "MVP v2".
import type { ReactNode } from "react";

export type Tone = "ok" | "alerta" | "aviso" | "info" | "neutro";

const TONES: Record<Tone, string> = {
  ok: "bg-ok-claro text-ok",
  alerta: "bg-alerta-claro text-alerta",
  aviso: "bg-aviso-claro text-aviso",
  info: "bg-primario-claro text-primario",
  neutro: "bg-fondo text-suave",
};

export function toneClasses(tone: Tone): string {
  return TONES[tone];
}

/** Rounded status chip with a dot, e.g. "● Lista". */
export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Small uppercase monospace label used above titles and cards. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] uppercase tracking-wider text-suave ${className}`}>{children}</p>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-white p-5 ${className}`}>{children}</section>;
}

/** Square badge with initials or a short code (FR, DJ1, RSH). */
export function Badge({ children, className = "bg-fondo" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
