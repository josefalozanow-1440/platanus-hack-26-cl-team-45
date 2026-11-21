import { redirect } from "next/navigation";

import { apiGet } from "@/lib/api";

import type { ObservationsPage, Panel } from "../types";
import { Empty } from "../ui";
import { ObservationsView } from "./view";

export const dynamic = "force-dynamic";

export default async function ObservacionesPage({ searchParams }: { searchParams: Promise<{ comite?: string }> }) {
  const { comite } = await searchParams;
  if (!comite) {
    const panel = await apiGet<Panel>("/ep/panel");
    const withObservations = panel.comites.filter((row) => row.observations.total > 0);
    const target =
      withObservations.find((row) => row.observations.answered < row.observations.total) ?? withObservations[0];
    if (!target) return <Empty>Ningún comité tiene observaciones del SERVIU.</Empty>;
    redirect(`/ep/observaciones?comite=${target.slug}`);
  }
  const page = await apiGet<ObservationsPage>(`/ep/comites/${comite}/observaciones`);
  if (page.observations.length === 0) return <Empty>{page.name} no tiene observaciones del SERVIU.</Empty>;
  return <ObservationsView page={page} />;
}
