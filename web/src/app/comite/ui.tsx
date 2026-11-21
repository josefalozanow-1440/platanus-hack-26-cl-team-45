// Layout pieces shared by the two comité screens (C1, C2). Generic pieces live in @/components/ui.
import type { ReactNode } from "react";

import { Eyebrow, PageColumn } from "@/components/ui";

export { Callout, FolderCard } from "@/components/ui";

// shortcut: the demo has no login, so the comité screens always show Los Aromos.
export const DEMO_COMITE = "los-aromos";

export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}-${month}-${year}`;
}

export function Screen({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <PageColumn>
      <main className="flex flex-col gap-4">
        <header>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-1 text-[28px] leading-tight font-bold tracking-tight">{title}</h1>
        </header>
        {children}
      </main>
    </PageColumn>
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

export function ErrorScreen() {
  return (
    <Screen eyebrow="Directiva" title="No pudimos cargar esto">
      <p className="text-sm text-suave">La API no respondió. Revisa que esté corriendo y vuelve a cargar.</p>
    </Screen>
  );
}
