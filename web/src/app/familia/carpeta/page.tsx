// F2 · Familia · Mi carpeta
import Link from "next/link";

import { Badge, BUTTON, Card, Chip, Eyebrow, Folder, Pill } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Carpeta } from "../types";
import { Avatars, DOC_TONES, FamilyNav } from "../ui";

// Badge colour by document, as in the Figma. Unknown codes stay neutral.
const BADGE_COLORS: Record<string, string> = {
  RSH: "bg-ok-claro",
  CI: "bg-primario-claro",
  DJ1: "bg-alerta-claro",
  UF: "bg-aviso-claro",
};

// Who else has access: the comité leader is yellow, the entidad light blue and Folio dark blue.
const ACCESS_COLORS: Record<string, string> = {
  "Entidad Patrocinante": "bg-primario-claro",
  Copiloto: "bg-primario text-white",
};

// shortcut: fixed colours, the API does not send the state of the other carpetas of the comité.
const COMITE_SQUARES = ["bg-alerta-claro", "bg-ok-claro", "bg-aviso-claro", "bg-linea", "bg-primario-claro", "bg-ok-claro"];

export default async function CarpetaPage() {
  const carpeta = await apiGet<Carpeta>("/familia/carpeta");
  const { progress } = carpeta;
  const segments = [
    { count: progress.listos, color: "bg-ok", label: `${progress.listos} listos` },
    { count: progress.por_vencer, color: "bg-amarillo", label: `${progress.por_vencer} por vencer` },
    { count: progress.faltan, color: "bg-alerta", label: `${progress.faltan} falta` },
  ].filter((segment) => segment.count > 0);

  return (
    <main>
      <Eyebrow className="mb-4">Mi carpeta</Eyebrow>

      <Card>
        <Folder tone={progress.faltan > 0 ? "alerta" : progress.por_vencer > 0 ? "aviso" : "ok"} className="mx-auto mb-3 w-36" />
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight">{carpeta.family_name}</h1>
            <p className="text-xs text-suave">
              {carpeta.comite_name} · {carpeta.member_count} integrantes
            </p>
          </div>
          <p className="text-2xl font-semibold text-suave" data-testid="carpeta-progress">
            {progress.ready} / {progress.total}
          </p>
        </div>
        <div className="mt-3 flex h-1.5 gap-1">
          {segments.map((segment) => (
            <span key={segment.label} className={`rounded-full ${segment.color}`} style={{ flexGrow: segment.count }} />
          ))}
        </div>
        <ul className="mt-2 flex gap-4 text-xs text-suave">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-sm ${segment.color}`} />
              {segment.label}
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-linea pt-4">
          <h3 className="text-sm font-semibold">Quién tiene acceso</h3>
          <div className="mt-2 flex items-center gap-3">
            <Avatars people={carpeta.family_access} />
            <span className="h-6 w-px bg-linea" />
            <div className="flex -space-x-1.5">
              {carpeta.others_access.map((person) => (
                <Avatars
                  key={person.name}
                  // The API still calls the agent "Copiloto"; the product name is Folio.
                  people={[person.name === "Copiloto" ? { name: "Folio", initials: "F" } : person]}
                  className={ACCESS_COLORS[person.name] ?? "bg-aviso-claro"}
                />
              ))}
            </div>
            <Link href="/familia/privacidad" className="ml-auto rounded-full border border-linea px-4 py-1.5 text-sm font-semibold">
              Editar
            </Link>
          </div>
          <p className="mt-2 text-xs text-suave">
            Tu familia ve todo · el comité, solo el estado · la entidad, tus documentos · el Folio te acompaña
          </p>
        </div>
      </Card>

      {carpeta.pending_action && (
        <section className="mt-4 rounded-3xl bg-alerta-claro p-5">
          <Eyebrow className="!text-alerta">Acción pendiente</Eyebrow>
          <h2 className="mt-1 font-semibold">{carpeta.pending_action.title}</h2>
          <p className="mt-1 text-sm text-suave">{carpeta.pending_action.body}</p>
          <Link href="/familia/invitar" className={`mt-3 ${BUTTON.primary}`}>
            Enviar enlace a {carpeta.pending_action.member_name}
          </Link>
        </section>
      )}

      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Documentos</h2>
          <span className="text-xs text-suave">{carpeta.documents.length}</span>
        </div>
        {/* shortcut: the chips show the counts but do not filter yet. */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip active>Todos</Chip>
          <Chip>Falta {progress.faltan}</Chip>
          <Chip>Vence {progress.por_vencer}</Chip>
          <Chip>Listos {progress.listos}</Chip>
        </div>
        <ul className="mt-3 divide-y divide-linea rounded-3xl bg-white px-4">
          {carpeta.documents.map((document) => (
            <li key={document.kind} className="flex items-center gap-3 py-3">
              <Badge className={BADGE_COLORS[document.code] ?? "bg-fondo"}>{document.code}</Badge>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{document.name}</p>
                {document.detail && <p className="text-xs text-suave">{document.detail}</p>}
              </div>
              <Pill tone={DOC_TONES[document.status]}>{document.status_label}</Pill>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-3xl bg-primario-claro p-4">
        <div className="flex items-center justify-between text-sm font-medium text-primario">
          <span>Tu comité</span>
          <span className="font-mono" data-testid="comite-progress">
            {carpeta.comite_progress.complete} / {carpeta.comite_progress.total}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-primario">
          <div aria-hidden className="flex -space-x-1">
            {COMITE_SQUARES.map((color, index) => (
              <span key={index} className={`h-6 w-8 rounded-md border border-white ${color}`} />
            ))}
          </div>
          +{carpeta.comite_progress.complete} carpetas listas
        </div>
      </section>

      <FamilyNav current="/familia/carpeta" />
    </main>
  );
}
