import type { ReactNode } from "react";

import { Shell } from "@/components/sidebar";

const ITEMS = [
  { label: "Carpetas del grupo", href: "/comite/carpetas" },
  { label: "Renuncia y reemplazo", href: "/comite/reemplazo" },
  { label: "Asamblea", href: "/comite/asamblea" },
  { label: "Folio", href: "/comite/folio" },
];

export default function ComiteLayout({ children }: { children: ReactNode }) {
  return (
    <Shell subtitle="Directiva · Comité Los Aromos" items={ITEMS}>
      {children}
    </Shell>
  );
}
