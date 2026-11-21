import { redirect } from "next/navigation";

import { apiGet } from "@/lib/api";

import type { Panel } from "../types";
import { Empty } from "../ui";

export const dynamic = "force-dynamic";

// "Carpetas" in the sidebar opens the comité with the fewest complete carpetas.
export default async function CarpetaIndex() {
  const panel = await apiGet<Panel>("/ep/panel");
  const [target] = [...panel.comites].sort(
    (a, b) => a.folders.complete / a.folders.total - b.folders.complete / b.folders.total,
  );
  if (!target) return <Empty>Todavía no hay comités.</Empty>;
  redirect(`/ep/carpeta/${target.slug}`);
}
