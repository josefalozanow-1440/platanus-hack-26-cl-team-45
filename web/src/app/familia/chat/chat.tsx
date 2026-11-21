"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { Pill } from "@/components/ui";

import type { Carpeta } from "../types";

type Message =
  | { kind: "bot" | "user"; text: string }
  | { kind: "report" }
  | { kind: "signature" }
  | { kind: "deadline" };

const ANSWERS: Record<string, string> = {
  "¿Cómo deposito?":
    "Deposita en tu cuenta de ahorro para la vivienda, en el mismo banco del mandato. Puede ser en caja o por transferencia. Cuando lo hagas, mándame una foto del comprobante.",
  "¿Qué es DJ49-1?":
    "Es la declaración de núcleo familiar: dice quiénes viven contigo. La firman todos los mayores de 18 años del hogar.",
};

const REPORT_ICONS = { listo: "✓", falta: "✕", vence: "!", no_aplica: "–" } as const;
const REPORT_COLORS = { listo: "text-ok", falta: "text-alerta", vence: "text-aviso", no_aplica: "text-suave" } as const;

function Bubble({ from, children }: { from: "bot" | "user"; children: string }) {
  return from === "user" ? (
    <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primario px-4 py-2.5 text-sm text-white">{children}</p>
  ) : (
    <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm">{children}</p>
  );
}

function CardHeader({ tag }: { tag: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className="inline-flex size-5 items-center justify-center rounded-md bg-primario text-[10px] text-white">C</span>
      Copiloto
      <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-suave">{tag}</span>
    </div>
  );
}

export function Chat({ carpeta }: { carpeta: Carpeta }) {
  const pending = carpeta.pending_action;
  const cutoff = carpeta.savings_cutoff;
  const missing = carpeta.progress.faltan + carpeta.progress.por_vencer;
  const followUp: Message[] = [
    { kind: "bot", text: "Lo otro es tu ahorro. Te dejo el plazo:" },
    { kind: "deadline" },
  ];
  const [messages, setMessages] = useState<Message[]>([
    {
      kind: "bot",
      text: `Hola ${carpeta.contact_name?.split(" ")[0] ?? ""}. A tu carpeta le faltan ${missing} cosas para que el comité pueda responder al SERVIU.`,
    },
    { kind: "report" },
    ...(pending ? [{ kind: "signature" } as const] : followUp),
  ]);
  const [linkSent, setLinkSent] = useState(false);
  const [draft, setDraft] = useState("");

  function add(...next: Message[]) {
    setMessages((current) => [...current, ...next]);
  }

  function sendLink() {
    setLinkSent(true);
    add(
      { kind: "user", text: "Mándaselo, porfa" },
      {
        kind: "bot",
        text: `Listo. ${pending?.member_name} recibió el enlace para firmar con su ClaveÚnica. Te aviso cuando firme.`,
      },
      ...followUp,
    );
  }

  function ask(question: string) {
    add({ kind: "user", text: question }, { kind: "bot", text: ANSWERS[question] });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    add({ kind: "user", text: draft }, { kind: "bot", text: "Lo reviso y te respondo por aquí en un rato." });
    setDraft("");
  }

  function render(message: Message, index: number) {
    if (message.kind === "bot" || message.kind === "user") {
      return <Bubble key={index} from={message.kind}>{message.text}</Bubble>;
    }
    if (message.kind === "report") {
      return (
        <section key={index} className="rounded-2xl bg-white p-4">
          <CardHeader tag="Informe" />
          <h2 className="mt-2 font-semibold">Revisé tu carpeta parte por parte</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {carpeta.documents.map((document) => (
              <li key={document.kind} className="flex gap-2">
                <span className={`w-4 text-center font-semibold ${REPORT_COLORS[document.status]}`}>
                  {REPORT_ICONS[document.status]}
                </span>
                <span>
                  {document.name}
                  {document.status !== "listo" && `: ${document.status_label.toLowerCase()}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between text-xs text-suave">
            <span>
              {carpeta.progress.ready} de {carpeta.progress.total} listos
            </span>
            <span className="font-mono">art. 3 D.S. 49</span>
          </p>
        </section>
      );
    }
    if (message.kind === "signature" && pending) {
      return (
        <section key={index} className="rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-alerta-claro font-mono text-[10px]">DJ1</span>
            <div>
              <h2 className="text-sm font-semibold">Núcleo familiar</h2>
              <p className="text-xs text-suave">Falta la firma de {pending.member_name}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {carpeta.dj49_1_signers.map((signer) => (
              <Pill key={signer.first_name} tone={signer.signed ? "ok" : "alerta"}>
                {signer.first_name}
              </Pill>
            ))}
          </div>
          <button
            type="button"
            onClick={sendLink}
            disabled={linkSent}
            className="mt-3 w-full rounded-xl bg-primario-claro py-2.5 text-sm font-medium text-primario disabled:opacity-60"
          >
            {linkSent ? "Enlace enviado" : `Enviar enlace a ${pending.member_name}`}
          </button>
        </section>
      );
    }
    if (message.kind === "deadline" && cutoff) {
      return (
        <section key={index} className="rounded-2xl bg-white p-4">
          <CardHeader tag="Plazo" />
          <p className="mt-2 text-2xl font-semibold text-primario">{cutoff.due_on.split("-").reverse().join("-")}</p>
          <p className="mt-1 text-sm text-suave">
            Ese día el banco certifica tu ahorro. Necesitas {Number(cutoff.required_uf)} UF; hoy tienes{" "}
            {String(Number(cutoff.savings_uf)).replace(".", ",")} UF.
          </p>
          <p className="mt-2 flex justify-between text-xs">
            <span className="font-mono text-aviso">Faltan {cutoff.days_left} días</span>
            <span className="font-mono text-suave">art. 39 D.S. 49</span>
          </p>
        </section>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3" data-testid="chat-messages">
        {messages.map(render)}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.keys(ANSWERS).map((question) => (
          <button key={question} type="button" onClick={() => ask(question)} className="rounded-full bg-white px-3 py-1.5 text-xs">
            {question}
          </button>
        ))}
        <Link href="/familia/carpeta" className="rounded-full bg-white px-3 py-1.5 text-xs">
          Ver mi carpeta
        </Link>
      </div>

      <p className="mt-3 rounded-2xl bg-primario-claro px-4 py-2.5 text-xs text-primario">
        {carpeta.comite_progress.complete} de {carpeta.comite_progress.total} familias ya completaron su carpeta
      </p>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-full bg-white p-1.5 pl-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe o envía una foto"
          aria-label="Mensaje para el Copiloto"
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button type="submit" className="rounded-full bg-primario px-4 py-1.5 text-xs font-medium text-white">
          Enviar
        </button>
      </form>
    </div>
  );
}
