// B1 · Familia · Te toca (shell with fixed data)
import Link from "next/link";
import type { ReactNode } from "react";

import { BUTTON, Card, Eyebrow, Initials } from "@/components/ui";

import { ActivityList, Faces, GROUP_FACES } from "../grupo/people";
import { FamilyNav, ScreenTitle } from "../ui";
import { TE_TOCA } from "./data";

function TaskHeader({ label, when, className }: { label: string; when: string; className: string }) {
  return (
    <div className="flex items-center justify-between text-xs text-suave">
      <Eyebrow className={className}>{label}</Eyebrow>
      {when}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-6 mb-3 text-lg font-semibold">{children}</h2>;
}

export default function TeTocaPage() {
  const { vote, savings, mention } = TE_TOCA;
  return (
    <main>
      <ScreenTitle eyebrow={TE_TOCA.person}>Te toca</ScreenTitle>

      <div className="flex rounded-full bg-white p-1 text-xs font-medium">
        {TE_TOCA.tabs.map((tab, index) => (
          <span
            key={tab.label}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 ${index === 0 ? "bg-primario text-white" : "text-suave"}`}
          >
            {tab.label}
            {tab.count && (
              <span className={`rounded-full px-1.5 text-[10px] text-primario ${index === 0 ? "bg-white" : "bg-primario-claro"}`}>
                {tab.count}
              </span>
            )}
          </span>
        ))}
      </div>

      <Card className="mt-3 border-[1.5px] border-primario">
        <TaskHeader label="Te toca · Votar" when={vote.closes} className="!text-primario" />
        <h2 className="mt-3 text-[17px] font-semibold leading-snug">{vote.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-suave">
          <Faces people={GROUP_FACES} />
          {vote.turnout}
        </p>
        <Link href="/comite/asamblea" className={`mt-4 ${BUTTON.primary}`}>
          Votar
        </Link>
      </Card>

      <Card className="mt-3">
        <TaskHeader label="Te toca · Ahorro" when={savings.due} className="!text-aviso" />
        <h2 className="mt-3 text-[17px] font-semibold leading-snug">{savings.title}</h2>
        <p className="mt-2 text-sm text-suave">{savings.body}</p>
        <Link href="/familia/chat" className={`mt-4 ${BUTTON.soft}`}>
          Cómo depositar
        </Link>
      </Card>

      <SectionTitle>Menciones</SectionTitle>
      <Card>
        <div className="flex gap-3">
          <Initials tone="aviso" size="size-10">
            {mention.initials}
          </Initials>
          <div className="text-sm">
            <p>
              <span className="font-semibold">{mention.name}</span> <span className="text-xs text-suave">· {mention.meta}</span>
            </p>
            <p className="mt-0.5">{mention.text}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {mention.replies.map((reply, index) => (
            <button key={reply} type="button" className={index === 0 ? BUTTON.primary : BUTTON.secondary}>
              {reply}
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>Del grupo</SectionTitle>
      <Card>
        <ActivityList items={TE_TOCA.activity} />
      </Card>

      <FamilyNav current="/familia/te-toca" />
    </main>
  );
}
