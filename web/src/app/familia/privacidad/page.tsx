// F0 · Familia · Quién ve tu carpeta
import { FolderCard } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Privacy } from "../types";
import { ScreenTitle } from "../ui";
import { PrivacyForm } from "./privacy-form";

export default async function PrivacidadPage() {
  const privacy = await apiGet<Privacy>("/familia/privacidad");
  return (
    <main>
      <ScreenTitle eyebrow="Compartir">¿Quién ve tu carpeta?</ScreenTitle>

      <div>
        <FolderCard
          tone="alerta"
          tab={privacy.comite_name}
          name={privacy.family_name}
          detail="Tú decides qué ve cada uno"
          badge={`${privacy.progress.ready} / ${privacy.progress.total}`}
        />
      </div>

      <PrivacyForm comiteName={privacy.comite_name} epName={privacy.ep_name} initial={privacy.settings} />
    </main>
  );
}
