import type { ReactNode } from "react";

import { Nav } from "./nav";

export default function EpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-fondo text-tinta">
      <aside className="w-60 shrink-0 border-r border-linea bg-white px-4 py-8">
        <p className="px-3 font-semibold">Copiloto de Carpeta</p>
        <p className="px-3 text-xs text-suave">Entidad Patrocinante Sur</p>
        <Nav />
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-5 px-10 py-8">{children}</main>
    </div>
  );
}
