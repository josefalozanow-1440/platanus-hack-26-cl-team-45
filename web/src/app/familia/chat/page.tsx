// F1 · Familia · Copiloto por chat
import { apiGet } from "@/lib/api";

import type { Carpeta } from "../types";
import { Chat } from "./chat";

export default async function ChatPage() {
  const carpeta = await apiGet<Carpeta>("/familia/carpeta");
  return (
    <main className="flex min-h-[796px] flex-col">
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primario-claro font-semibold text-primario">
          C
        </span>
        <div>
          <h1 className="text-lg font-semibold">Copiloto de Carpeta</h1>
          <p className="text-xs text-suave">{carpeta.comite_name} · en línea</p>
        </div>
      </header>
      <Chat carpeta={carpeta} />
    </main>
  );
}
