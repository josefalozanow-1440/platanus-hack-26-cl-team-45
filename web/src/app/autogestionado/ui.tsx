// Pieces shared by the screens of the comité autogestionado (E5, E5b).
import type { ReactNode } from "react";

/** Desktop buttons: same look as BUTTON in @/components/ui, but as wide as their text. */
export const ACTION = {
  primary: "rounded-2xl bg-primario px-6 py-3.5 text-[15px] font-semibold text-white",
  secondary: "rounded-2xl border border-linea bg-white px-6 py-3.5 text-[15px] font-semibold",
};

export function Title({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header>
      <h1 className="text-[28px] leading-tight font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-suave">{children}</p>
    </header>
  );
}

/** Row of buttons at the bottom right of the screen. */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
