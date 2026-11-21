// F0 · Familia · Quién ve tu carpeta
import { apiGet } from "@/lib/api";

import type { Privacy } from "../types";
import { ScreenTitle } from "../ui";
import { PrivacyForm } from "./privacy-form";

export default async function PrivacidadPage() {
  const privacy = await apiGet<Privacy>("/familia/privacidad");
  return (
    <main>
      <ScreenTitle eyebrow="Compartir">¿Quién ve tu carpeta?</ScreenTitle>

      <span className="ml-0 inline-block rounded-t-xl bg-alerta-claro px-3 pt-1.5 font-mono text-[11px] uppercase tracking-wider text-suave">
        {privacy.comite_name}
      </span>
      <section className="flex items-center gap-3 rounded-3xl rounded-tl-none bg-alerta-claro p-4">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white font-semibold">FR</span>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{privacy.family_name}</h2>
          <p className="text-xs text-suave">Tú decides qué ve cada uno</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 font-mono text-xs">
          {privacy.progress.ready} / {privacy.progress.total}
        </span>
      </section>

      <PrivacyForm comiteName={privacy.comite_name} epName={privacy.ep_name} initial={privacy.settings} />
    </main>
  );
}
