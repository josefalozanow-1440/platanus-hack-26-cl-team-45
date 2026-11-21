import type { ReactNode } from "react";

import { Shell } from "@/components/sidebar";

const ITEMS = [
  { label: "Panel de grupos", href: "/ep/panel" },
  { label: "Observaciones", href: "/ep/observaciones" },
  { label: "Carpetas", href: "/ep/carpetas", match: "/ep/carpeta" },
  { label: "Actas y asistencia" },
  { label: "Plazos" },
];

export default function EpLayout({ children }: { children: ReactNode }) {
  return (
    <Shell subtitle="Entidad Patrocinante Sur" items={ITEMS}>
      <main className="flex flex-col gap-5 px-4 py-6 lg:px-10 lg:py-8">{children}</main>
    </Shell>
  );
}
