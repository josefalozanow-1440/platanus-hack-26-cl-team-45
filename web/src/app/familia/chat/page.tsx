// F1 · Familia · Folio por chat
import { apiGet } from "@/lib/api";

import type { Carpeta } from "../types";
import { Chat } from "./chat";

export default async function ChatPage() {
  const carpeta = await apiGet<Carpeta>("/familia/carpeta");
  return (
    <main className="flex min-h-[796px] flex-col">
      <header className="mb-4 flex items-center gap-3">
        <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-2xl bg-primario-claro font-semibold">
          F
        </span>
        <div>
          <h1 className="text-lg font-semibold leading-tight">Folio</h1>
          <p className="text-xs text-suave">{carpeta.comite_name} · en línea</p>
        </div>
      </header>
      <Chat carpeta={carpeta} />
    </main>
  );
}
