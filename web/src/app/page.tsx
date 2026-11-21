// Role picker for the pitch: one link per screen of the Figma "MVP v2".
import Link from "next/link";

import { Eyebrow } from "@/components/ui";
import { apiGet } from "@/lib/api";

// Rendered on every request so it shows the current API status.
export const dynamic = "force-dynamic";

type ComponentStatus = "ok" | "down";
type Health = { api: ComponentStatus; db: ComponentStatus };

const LABELS: Record<ComponentStatus, string> = { ok: "funciona", down: "caída" };

type Screen = { code: string; href: string; title: string; who: string };
type Role = { name: string; description: string; screens: Screen[] };

const ROLES: Role[] = [
  {
    name: "Familia",
    description: "Marta Rojas y su familia, del Comité Los Aromos. Se ve en el celular.",
    screens: [
      { code: "F0", href: "/familia/privacidad", title: "¿Quién ve tu carpeta?", who: "Marta" },
      { code: "F1", href: "/familia/chat", title: "Copiloto por chat", who: "Marta" },
      { code: "F2", href: "/familia/carpeta", title: "Mi carpeta", who: "Marta" },
      { code: "F3", href: "/familia/grupo", title: "Cómo va tu grupo", who: "Marta" },
      { code: "F4", href: "/familia/firma", title: "Firma con ClaveÚnica", who: "Pedro, 19 años" },
    ],
  },
  {
    name: "Comité",
    description: "La directiva del Comité Los Aromos: 40 familias.",
    screens: [
      { code: "C1", href: "/comite/carpetas", title: "Carpetas del grupo", who: "Directiva" },
      { code: "C2", href: "/comite/reemplazo", title: "Renuncia y reemplazo", who: "Directiva" },
    ],
  },
  {
    name: "Entidad Patrocinante",
    description: "Entidad Patrocinante Sur: 4 comités y 148 familias. Se ve en el computador.",
    screens: [
      { code: "E1", href: "/ep/panel", title: "Panel de grupos", who: "Equipo EP" },
      { code: "E2", href: "/ep/observaciones", title: "Observaciones del SERVIU", who: "Equipo EP" },
      { code: "E3", href: "/ep/carpeta/villa-nueva", title: "Carpeta del grupo", who: "Equipo EP" },
    ],
  },
];

async function fetchHealth(): Promise<Health> {
  try {
    return await apiGet<Health>("/health");
  } catch {
    return { api: "down", db: "down" };
  }
}

export default async function Home() {
  const health = await fetchHealth();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Eyebrow>DS49 colectivo · datos ficticios</Eyebrow>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Comité</h1>
      <p className="mt-2 max-w-xl text-suave">
        Copiloto de carpeta para comités de vivienda. Elige quién eres para ver su pantalla.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {ROLES.map((role) => (
          <section key={role.name} className="rounded-3xl bg-white p-5">
            <h2 className="text-lg font-semibold">{role.name}</h2>
            <p className="mt-1 text-sm text-suave">{role.description}</p>
            <ul className="mt-4 space-y-2">
              {role.screens.map((screen) => (
                <li key={screen.href}>
                  <Link
                    href={screen.href}
                    className="flex items-center gap-3 rounded-2xl border border-linea px-3 py-2.5 hover:border-primario hover:bg-primario-claro"
                  >
                    <span className="font-mono text-xs text-primario">{screen.code}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{screen.title}</span>
                      <span className="block text-xs text-suave">{screen.who}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <dl className="mt-10 flex flex-wrap gap-x-6 gap-y-1 text-xs text-suave">
        <div className="flex gap-2">
          <dt>API</dt>
          <dd data-testid="api-status">{LABELS[health.api]}</dd>
        </div>
        <div className="flex gap-2">
          <dt>Base de datos</dt>
          <dd data-testid="db-status">{LABELS[health.db]}</dd>
        </div>
        <div>
          <Link href="/estado" className="underline">
            Estado del proyecto
          </Link>
        </div>
      </dl>
    </main>
  );
}
