// Folio is the agent of the product (the Figma renamed "Copiloto" to "Folio"). These are its shared pieces.
import type { ReactNode } from "react";

/** Blue square with an F: the face of Folio. */
export function FolioMark({ className = "size-6 text-[11px]" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-primario font-bold text-white ${className}`}>
      F
    </span>
  );
}

/** Monospace chip with the legal source, e.g. "art. 39 D.S. 49". */
export function Cite({ children }: { children: ReactNode }) {
  return <span className="rounded-md border border-linea bg-fondo px-2 py-0.5 font-mono text-[11px] text-suave">{children}</span>;
}

/** Card written by Folio inside a chat or a page: header "F Folio … LABEL", then the content. */
export function FolioCard({ label, children, className = "" }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-linea bg-white p-4 ${className}`}>
      <header className="mb-3 flex items-center gap-2">
        <FolioMark />
        <span className="text-sm font-semibold">Folio</span>
        {label && <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-suave">{label}</span>}
      </header>
      {children}
    </section>
  );
}

/** Last row of a FolioCard: a monospace note on the left and the sources on the right. */
export function FolioFooter({ note, children }: { note?: ReactNode; children?: ReactNode }) {
  return (
    <footer className="mt-3 flex items-center justify-between gap-2">
      <span className="font-mono text-xs text-aviso">{note}</span>
      <span className="flex gap-1">{children}</span>
    </footer>
  );
}

const CHECKS = {
  ok: { icon: "✓", box: "bg-ok-claro text-ok", text: "text-suave" },
  falta: { icon: "✕", box: "bg-alerta-claro text-alerta", text: "font-medium" },
  aviso: { icon: "!", box: "bg-aviso-claro text-aviso", text: "font-medium" },
};

/** Row of a Folio report: ✓ done, ✕ missing, ! about to expire. */
export function CheckItem({ state, children }: { state: keyof typeof CHECKS; children: ReactNode }) {
  const check = CHECKS[state];
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span aria-hidden className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${check.box}`}>
        {check.icon}
      </span>
      <span className={check.text}>{children}</span>
    </li>
  );
}

/** Light blue note signed by Folio, e.g. "Cierra el sábado 30-11 a las 18:00…". */
export function FolioNote({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-primario-claro p-4 text-sm text-primario">
      <p className="mb-1 flex items-center gap-2 font-semibold">
        <FolioMark className="size-5 text-[10px]" />
        Folio
      </p>
      {children}
    </section>
  );
}

/** Chat bubble. "me" is the person, anything else is Folio. */
export function Bubble({ me = false, children }: { me?: boolean; children: ReactNode }) {
  return (
    <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${me ? "ml-auto bg-primario text-white" : "bg-white"}`}>{children}</p>
  );
}
