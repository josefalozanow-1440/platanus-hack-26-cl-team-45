import { NowBanner } from "@/components/ui";

import { CarpetasView } from "../view";
import { AFTER_SIGNATURE, EXPIRING, FOLIO_LINE } from "./data";

/** C1b: C1 right after Pedro Rojas signed. Fixed data, nothing is sent. */
export default function DespuesDeLaFirmaPage() {
  return (
    <CarpetasView
      page={AFTER_SIGNATURE}
      folio={FOLIO_LINE}
      expiring={EXPIRING}
      live={false}
      banner={
        <NowBanner label="Ahora · Pedro Rojas firmó">La Familia Rojas pasó a amarillo: solo le falta el ahorro.</NowBanner>
      }
    />
  );
}
