import { apiGet } from "@/lib/api";

import type { ComiteCarpetas } from "../types";
import { DEMO_COMITE, ErrorScreen } from "../ui";
import { CarpetasView } from "./view";

export const dynamic = "force-dynamic";

export default async function CarpetasPage() {
  let page: ComiteCarpetas;
  try {
    page = await apiGet<ComiteCarpetas>(`/comite/${DEMO_COMITE}/carpetas`);
  } catch {
    return <ErrorScreen />;
  }
  return <CarpetasView page={page} />;
}
