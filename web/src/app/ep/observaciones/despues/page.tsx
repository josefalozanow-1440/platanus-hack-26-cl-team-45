import { NowBanner } from "@/components/ui";

import { ObservationsView } from "../view";
import { AFTER_SIGNATURE, BANNER } from "./data";

// E2b: shell with fixed data, the same view as E2 once the three observations are answered.
export default function ObservacionesDespuesPage() {
  return <ObservationsView page={AFTER_SIGNATURE} banner={<NowBanner>{BANNER}</NowBanner>} />;
}
