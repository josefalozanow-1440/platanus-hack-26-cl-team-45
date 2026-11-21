import type { ReactNode } from "react";

import { Shell } from "@/components/sidebar";

// Only Llamado has a screen so far; the rest show in the Figma without one.
const ITEMS = [
  { label: "Grupo" },
  { label: "Llamado", href: "/autogestionado/llamado" },
  { label: "Carpetas" },
  { label: "Asambleas" },
  { label: "Plazos" },
];

export default function SelfManagedLayout({ children }: { children: ReactNode }) {
  return (
    <Shell subtitle="Comité Las Araucarias · autogestionado" items={ITEMS}>
      <main className="space-y-5 px-4 py-6 lg:px-10 lg:py-8">{children}</main>
    </Shell>
  );
}
