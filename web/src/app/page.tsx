// Rendered on every request so it shows the current API status.
export const dynamic = "force-dynamic";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

type ComponentStatus = "ok" | "down";
type Health = { api: ComponentStatus; db: ComponentStatus };

const LABELS: Record<ComponentStatus, string> = { ok: "funciona", down: "caída" };

async function fetchHealth(): Promise<Health> {
  try {
    const response = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return await response.json();
  } catch {
    return { api: "down", db: "down" };
  }
}

export default async function Home() {
  const health = await fetchHealth();
  return (
    <main className="mx-auto max-w-xl p-8 font-sans">
      <h1 className="text-3xl font-bold">Comité</h1>
      <p className="mt-2 text-gray-600">Seguimiento de proyectos DS49 colectivos.</p>
      <dl className="mt-8 grid grid-cols-2 gap-2 text-sm">
        <dt>API</dt>
        <dd data-testid="api-status">{LABELS[health.api]}</dd>
        <dt>Base de datos</dt>
        <dd data-testid="db-status">{LABELS[health.db]}</dd>
      </dl>
    </main>
  );
}
