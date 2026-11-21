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

/** Class names for the three buttons of the Figma. Use them on <button>, <a> or <Link>. */
export const BUTTON = {
  primary: "block w-full rounded-2xl bg-primario px-4 py-3.5 text-center text-[15px] font-semibold text-white",
  secondary: "block w-full rounded-2xl border border-linea bg-white px-4 py-3.5 text-center text-[15px] font-semibold",
  soft: "block w-full rounded-2xl bg-primario-claro px-4 py-3.5 text-center text-[15px] font-semibold text-primario",
};

/** Filter chip, e.g. "Todos", "Falta 1". The active one is dark. */
export function Chip({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${active ? "bg-tinta text-white" : "border border-linea bg-white"}`}>
      {children}
    </span>
  );
}

/** Coloured number tile, e.g. "34 listas" or "128 de 148 familias con carpeta completa". */
export function Stat({ tone, value, label }: { tone: Tone; value: ReactNode; label: string }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 ${TONES[tone]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs">{label}</p>
    </div>
  );
}

/** Tinted box with a monospace label on top (corte del ahorro, último día, efecto). */
export function Callout({ tone, label, children }: { tone: Tone; label: string; children: ReactNode }) {
  return (
    <section className={`rounded-3xl p-4 ${TONES[tone]}`}>
      <Eyebrow className="!text-current">{label}</Eyebrow>
      <div className="mt-1 text-tinta">{children}</div>
    </section>
  );
}

/** Green strip with the latest event, e.g. "AHORA Pedro Rojas firmó la DJ49-1". */
export function NowBanner({ label = "Ahora", children }: { label?: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 rounded-2xl bg-ok-claro px-4 py-3 text-sm">
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-ok" />
      <span className="font-mono text-[11px] uppercase tracking-wider text-ok">{label}</span>
      <span>{children}</span>
    </p>
  );
}

const TINTS: Record<Tone, string> = {
  ok: "bg-ok-claro",
  alerta: "bg-alerta-claro",
  aviso: "bg-aviso-claro",
  info: "bg-primario-claro",
  neutro: "bg-linea",
};

/** Small square with initials, tinted by tone (MR, VS, EP). */
export function Initials({ tone = "alerta", size = "size-9", children }: { tone?: Tone; size?: string; children: ReactNode }) {
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${size} ${TINTS[tone]}`}>
      {children}
    </span>
  );
}

/** "Folder" card of the Figma: a labelled tab on top of a tinted card with the family and its progress. */
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
  const tint = TINTS[tone];
  return (
    <article aria-label={name} className="-mt-3 first:mt-0">
      <Eyebrow className={`inline-block rounded-t-2xl px-4 pt-2 pb-1 ${tint}`}>{tab}</Eyebrow>
      <div className={`flex items-center gap-4 rounded-3xl rounded-tl-none p-4 shadow-[0_-4px_12px_rgba(22,33,58,0.06)] ${tint}`}>
        <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-base font-semibold">
          {initials(name.replace(/^Familia /, "F "))}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl leading-tight font-semibold">{name}</p>
          <p className="text-sm text-suave">{detail}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 font-mono text-sm whitespace-nowrap">{badge}</span>
      </div>
    </article>
  );
}

const FOLDER_COLORS: Record<Tone, [back: string, light: string, dark: string]> = {
  alerta: ["#f3c3c8", "#fbe3e5", "#f5c9ce"],
  ok: ["#c3e3cc", "#e3f4e8", "#c9e6d1"],
  aviso: ["#f3dc8a", "#fcf3cf", "#f5e3a0"],
  info: ["#bfd0ee", "#e3ebf9", "#c4d4f0"],
  neutro: ["#dde2ec", "#f1f3f8", "#e0e4ee"],
};

/** Folder illustration of the Figma. The tone is the state of the carpeta. */
export function Folder({ tone, className = "w-32" }: { tone: Tone; className?: string }) {
  const [back, light, dark] = FOLDER_COLORS[tone];
  return (
    <svg aria-hidden viewBox="0 0 120 92" className={`drop-shadow-md ${className}`}>
      <defs>
        <linearGradient id={`folder-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <rect x="8" y="4" width="46" height="22" rx="8" fill={back} />
      <rect x="8" y="14" width="104" height="64" rx="10" fill={back} />
      <rect x="20" y="20" width="80" height="46" rx="5" fill="#fff" />
      <rect x="28" y="28" width="40" height="3" rx="1.5" fill="#dde3ee" />
      <rect x="28" y="35" width="56" height="3" rx="1.5" fill="#dde3ee" />
      <rect x="4" y="40" width="112" height="48" rx="10" fill={`url(#folder-${tone})`} opacity="0.94" />
      <rect x="20" y="76" width="80" height="2.5" rx="1.25" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/** Container of the screens designed for the phone: full width on a phone, a centred column on larger screens. */
export function PageColumn({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-screen w-full max-w-2xl px-5 pb-8 pt-6 md:px-8 md:pt-10">{children}</div>;
}
