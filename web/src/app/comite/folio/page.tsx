import Link from "next/link";

import { Bubble, CheckItem, Cite, FolioCard, FolioFooter, FolioMark } from "@/components/folio";
import { BUTTON, PageColumn } from "@/components/ui";

import { DEADLINE, INTRO, OFFER, QUESTION, REPORT, SUGGESTIONS } from "./data";

/** C3: Folio's chat for the directiva. Fixed conversation, nothing is sent. */
export default function FolioPage() {
  return (
    <PageColumn>
      <main className="flex flex-col gap-3">
        <header className="mb-1 flex items-center gap-3">
          <FolioMark className="size-11 !rounded-xl text-lg" />
          <div>
            <h1 className="text-lg leading-tight font-semibold">Folio</h1>
            <p className="text-sm text-suave">Directiva · Comité Los Aromos</p>
          </div>
        </header>

        <Bubble me>{QUESTION}</Bubble>
        <Bubble>{INTRO}</Bubble>

        <FolioCard label="Plazo del grupo" className="mr-10">
          <p className="text-3xl font-bold text-primario">{DEADLINE.date}</p>
          <p className="mt-3 text-sm">{DEADLINE.text}</p>
          <FolioFooter note={DEADLINE.remaining}>
            <Cite>{DEADLINE.cite}</Cite>
          </FolioFooter>
        </FolioCard>

        <FolioCard label="Informe" className="mr-10">
          <h2 className="mb-3 font-semibold">{REPORT.title}</h2>
          <ul className="flex flex-col gap-2.5">
            {REPORT.items.map((item) => (
              <CheckItem key={item.text} state={item.state}>
                {item.text}
              </CheckItem>
            ))}
          </ul>
          <FolioFooter note={<span className="text-suave">{REPORT.summary}</span>}>
            <Cite>{REPORT.cite}</Cite>
          </FolioFooter>
        </FolioCard>

        <Bubble>{OFFER}</Bubble>

        <div className="flex gap-2">
          <button type="button" className={BUTTON.primary}>
            Sí, recuérdales
          </button>
          <button type="button" className={BUTTON.secondary}>
            Lo hago yo
          </button>
        </div>

        <div className="flex flex-col items-start gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <Link key={suggestion.text} href={suggestion.href} className="rounded-full border border-linea bg-white px-4 py-2 text-xs font-medium">
              {suggestion.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4">
          <input aria-label="Pregúntale al Folio" placeholder="Pregúntale al Folio" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          <button type="button" className="rounded-full bg-primario px-4 py-2 text-xs font-semibold text-white">
            Enviar
          </button>
        </div>
      </main>
    </PageColumn>
  );
}
