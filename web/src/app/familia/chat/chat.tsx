"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { Bubble, CheckItem, Cite, FolioCard, FolioFooter } from "@/components/folio";
import { Badge, BUTTON, Pill } from "@/components/ui";

import { Faces, GROUP_FACES } from "../grupo/people";
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

const CHECK_STATES = { listo: "ok", falta: "falta", vence: "aviso" } as const;
const QUICK = "rounded-full border border-linea bg-white px-3.5 py-2 text-xs font-medium";

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
      return <Bubble key={index} me={message.kind === "user"}>{message.text}</Bubble>;
    }
    if (message.kind === "report") {
      return (
        <FolioCard key={index} label="Informe">
          <h2 className="font-semibold">Revisé tu carpeta parte por parte</h2>
          <ul className="mt-3 space-y-2">
            {carpeta.documents.map(
              (document) =>
                document.status !== "no_aplica" && (
                  <CheckItem key={document.kind} state={CHECK_STATES[document.status]}>
                    {document.name.replace(/ \(.*\)/, "")}
                    {document.status !== "listo" && `: ${document.status_label[0].toLowerCase()}${document.status_label.slice(1)}`}
                  </CheckItem>
                ),
            )}
          </ul>
          <FolioFooter
            note={
              <span className="text-suave">
                {carpeta.progress.ready} de {carpeta.progress.total} listos
              </span>
            }
          >
            <Cite>art. 3 D.S. 49</Cite>
          </FolioFooter>
        </FolioCard>
      );
    }
    if (message.kind === "signature" && pending) {
      return (
        <section key={index} className="rounded-3xl bg-white p-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-alerta-claro">DJ1</Badge>
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
          <button type="button" onClick={sendLink} disabled={linkSent} className={`mt-3 disabled:opacity-60 ${BUTTON.soft}`}>
            {linkSent ? "Enlace enviado" : `Enviar enlace a ${pending.member_name}`}
          </button>
        </section>
      );
    }
    if (message.kind === "deadline" && cutoff) {
      return (
        <FolioCard key={index} label="Plazo">
          <p className="text-[28px] font-semibold leading-tight text-primario">{cutoff.due_on.split("-").reverse().join("-")}</p>
          <p className="mt-2 text-sm">
            Ese día el banco certifica tu ahorro. Necesitas {Number(cutoff.required_uf)} UF; hoy tienes{" "}
            {String(Number(cutoff.savings_uf)).replace(".", ",")} UF.
          </p>
          <FolioFooter note={`Faltan ${cutoff.days_left} días`}>
            <Cite>art. 39 D.S. 49</Cite>
          </FolioFooter>
        </FolioCard>
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
          <button key={question} type="button" onClick={() => ask(question)} className={QUICK}>
            {question}
          </button>
        ))}
        <Link href="/familia/carpeta" className={QUICK}>
          Ver mi carpeta
        </Link>
      </div>

      <p className="mt-3 flex items-center gap-3 rounded-2xl bg-primario-claro px-4 py-3 text-xs text-primario">
        <Faces people={GROUP_FACES} />
        <span>
          {carpeta.comite_progress.complete} de {carpeta.comite_progress.total} familias ya completaron su carpeta
        </span>
      </p>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-full bg-white p-1.5 pl-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe o envía una foto"
          aria-label="Mensaje para Folio"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {/* The text goes with Enter, as in the Figma. The photo upload is not built yet. */}
        <button type="button" className="rounded-full bg-primario px-4 py-2 text-xs font-semibold text-white">
          Foto
        </button>
      </form>
    </div>
  );
}
