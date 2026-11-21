// Right panel of E4: the chat with Folio about the group. Static shell, nothing is sent.
import { Bubble, CheckItem, Cite, FolioCard, FolioFooter, FolioMark } from "@/components/folio";

import { CHAT } from "./data";

const TABS = ["Info", "Folio", "Actividad"];

export function FolioPanel() {
  return (
    <aside aria-label="Folio" className="flex shrink-0 flex-col gap-4 rounded-3xl bg-white px-5 py-6 lg:w-[380px] lg:rounded-none lg:border-l lg:border-linea">
      <div className="flex gap-1 self-start rounded-full bg-fondo p-1 text-xs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={tab === "Folio"}
            className={`rounded-full px-3.5 py-1.5 ${tab === "Folio" ? "bg-white font-semibold" : "text-suave"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs text-suave">
        <FolioMark className="size-5 text-[10px]" />
        Folio · te acompaña en este grupo
      </p>

      {/* Bubble is white for the phone screens; on this white panel the ones of Folio need the page tint. */}
      <div className="flex flex-col gap-4 [&>p:not(.ml-auto)]:bg-fondo">
        <Bubble me>{CHAT.question}</Bubble>
        <Bubble>{CHAT.answer}</Bubble>
        <FolioCard label="Resumen">
          <h2 className="mb-3 font-semibold">Estado del grupo hoy</h2>
          <ul className="flex flex-col gap-2.5">
            {CHAT.summary.map((item) => (
              <CheckItem key={item.text} state={item.state}>
                {item.text}
              </CheckItem>
            ))}
          </ul>
          <FolioFooter note="34 de 40 listas">
            <Cite>art. 39 D.S. 49</Cite>
          </FolioFooter>
        </FolioCard>
        <Bubble>{CHAT.reminder}</Bubble>
      </div>
      <div>
        <Cite>arts. 14 y 20 D.S. 49</Cite>
      </div>
      <div className="flex flex-wrap gap-2">
        {CHAT.suggestions.map((suggestion) => (
          <button key={suggestion} type="button" className="rounded-full border border-linea bg-white px-3 py-1.5 text-xs font-medium">
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 rounded-2xl border border-linea bg-fondo p-1.5 pl-4">
          <span aria-hidden className="text-suave">
            +
          </span>
          <input aria-label="Pregúntale al Folio" placeholder="Pregúntale al Folio" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          <button type="button" className="rounded-xl bg-primario px-4 py-2 text-xs font-semibold text-white">
            Enviar
          </button>
        </div>
        <p className="mt-2 text-[11px] text-suave">El Folio propone; tú decides. No envía nada al SERVIU.</p>
      </div>
    </aside>
  );
}
