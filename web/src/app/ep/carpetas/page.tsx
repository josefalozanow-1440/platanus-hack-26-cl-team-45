// E4 · Carpetas del grupo + Folio. Static shell: the data lives in ./data.
import Link from "next/link";

import { Chip, Folder, Initials, Pill } from "@/components/ui";

import { FILTERS, FOLDERS, GROUP, type FamilyFolder } from "./data";
import { FolioPanel } from "./folio-panel";

function FamilyCard({ folder }: { folder: FamilyFolder }) {
  return (
    <article
      aria-label={folder.name}
      className={`rounded-3xl border p-4 ${folder.selected ? "border-primario bg-primario-claro" : "border-transparent bg-white"}`}
    >
      {/* The selected card shows the blue folder, whatever its state. */}
      <Folder tone={folder.selected ? "info" : folder.tone} className="mx-auto w-40" />
      <p className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold">{folder.name}</span>
        <span className="font-mono text-xs text-suave">{folder.progress}</span>
      </p>
      <p className="mt-1 text-sm text-suave">{folder.detail}</p>
      <p className="mt-3 flex min-h-7 items-center justify-between gap-2">
        <Pill tone={folder.tone}>{folder.status}</Pill>
        {folder.helper && (
          <Initials tone="aviso" size="size-7 text-[10px]">
            {folder.helper}
          </Initials>
        )}
        {folder.unassigned && <span className="text-xs font-medium text-alerta">Sin acompañante</span>}
      </p>
    </article>
  );
}

export default function GroupFoldersPage() {
  return (
    // The EP layout pads <main>; the negative margins let the Folio panel reach the edge of the window.
    <div className="flex flex-1 flex-col lg:-my-8 lg:-mr-10 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-5 pb-6 lg:py-8 lg:pr-8">
        <p className="text-xs text-suave">
          <Link href="/ep/panel" className="hover:underline">
            Grupos
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="font-medium text-tinta">{GROUP.name}</span>
        </p>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] leading-tight font-bold tracking-tight">Carpetas del grupo</h1>
            <p className="mt-1 text-sm text-suave">{GROUP.subtitle}</p>
          </div>
          <button type="button" className="shrink-0 rounded-2xl bg-primario px-6 py-3.5 text-[15px] font-semibold text-white">
            {GROUP.reminder}
          </button>
        </header>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            aria-label="Buscar familia"
            placeholder="Buscar familia"
            className="w-full rounded-2xl sm:w-64 border border-linea bg-white px-4 py-2.5 text-sm"
          />
          {FILTERS.map((filter, index) => (
            <Chip key={filter} active={index === 0}>
              {filter}
            </Chip>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FOLDERS.map((folder) => (
            <FamilyCard key={folder.name} folder={folder} />
          ))}
        </div>
      </div>
      <FolioPanel />
    </div>
  );
}
