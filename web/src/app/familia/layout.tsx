import type { ReactNode } from "react";

import { Shell } from "@/components/sidebar";
import { PageColumn } from "@/components/ui";

export const dynamic = "force-dynamic";

const ITEMS = [
  { label: "Mi carpeta", href: "/familia/carpeta" },
  { label: "Cómo va tu grupo", href: "/familia/grupo" },
  { label: "Te toca", href: "/familia/te-toca" },
  { label: "Folio", href: "/familia/chat" },
  { label: "Quién ve tu carpeta", href: "/familia/privacidad" },
];

// On a phone the family uses the bottom bar (FamilyNav); on a wide screen, the sidebar.
export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <Shell subtitle="Familia Rojas · Comité Los Aromos" items={ITEMS} sidebarClassName="hidden lg:block">
      <PageColumn>{children}</PageColumn>
    </Shell>
  );
}
