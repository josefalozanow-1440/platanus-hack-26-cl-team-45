// Layout pieces shared by the two comité screens (C1, C2). Generic pieces live in @/components/ui.
import type { ReactNode } from "react";

import { Eyebrow, initials, toneClasses, type Tone } from "@/components/ui";

// shortcut: the demo has no login, so the comité screens always show Los Aromos.
export const DEMO_COMITE = "los-aromos";

export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}-${month}-${year}`;
}

export function Screen({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-fondo text-tinta">
      <div className="mx-auto flex max-w-[420px] flex-col gap-4 px-5 pt-10 pb-12">
        <header>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-1 text-[28px] leading-tight font-bold tracking-tight">{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}

/** Tinted box with a monospace label on top (corte del ahorro, último día, efecto). */
export function Callout({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) {
  return (
    <section className={`rounded-3xl p-4 ${toneClasses(tone)}`}>
      <Eyebrow className="!text-current">{label}</Eyebrow>
      <div className="mt-1 text-tinta">{children}</div>
    </section>
  );
}

export function SectionTitle({ title, badge }: { title: string; badge?: ReactNode }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {badge}
    </div>
  );
}

export function Avatar({ name, className = "bg-white" }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-semibold ${className}`}
    >
      {initials(name)}
    </span>
  );
}

/** Stacked "folder" card from the Figma: a labelled tab on top of a tinted card. */
export function FolderCard({
  tone,
  tab,
  name,
  detail,
  badge,
}: {
  tone: Tone;
  tab: string;
  name: string;
  detail: string;
  badge: ReactNode;
}) {
  const tint = toneClasses(tone).split(" ")[0];
  return (
    <article aria-label={name} className="-mt-3 first:mt-0">
      <Eyebrow className={`inline-block rounded-t-2xl px-4 pt-2 pb-1 ${tint}`}>{tab}</Eyebrow>
      <div className={`flex items-center gap-4 rounded-3xl rounded-tl-none p-4 shadow-[0_-4px_12px_rgba(22,33,58,0.06)] ${tint}`}>
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <p className="text-xl leading-tight font-semibold">{name}</p>
          <p className="text-sm text-suave">{detail}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 font-mono text-sm whitespace-nowrap">{badge}</span>
      </div>
    </article>
  );
}

export function ErrorScreen() {
  return (
    <Screen eyebrow="Directiva" title="No pudimos cargar esto">
      <p className="text-sm text-suave">La API no respondió. Revisa que esté corriendo y vuelve a cargar.</p>
    </Screen>
  );
}
