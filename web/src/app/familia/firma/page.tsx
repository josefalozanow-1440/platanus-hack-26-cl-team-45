// F4 · Pedro · Firma con ClaveÚnica
import Link from "next/link";

import { BUTTON, Card, Eyebrow, Pill } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Firma } from "../types";
import { ScreenTitle } from "../ui";
import { SignButton, UndoButton } from "./sign-button";

function listNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} y ${names.at(-1)}` : names.join("");
}

export default async function FirmaPage() {
  const firma = await apiGet<Firma>("/familia/firma");
  const firstName = firma.signer_name.split(" ")[0];
  return (
    <main>
      <ScreenTitle eyebrow={`${firma.signer_name} · ${firma.signer_age} años`}>
        {firma.already_signed ? "Listo, ya firmaste" : "Tu familia necesita tu firma"}
      </ScreenTitle>

      <Card>
        <Eyebrow>Qué vas a firmar</Eyebrow>
        <h2 className="mt-1 text-lg font-semibold">Declaración de núcleo familiar (DJ49-1)</h2>
        <p className="mt-2 text-sm text-suave">
          Confirma que vives con {listNames(firma.lives_with)} y que nadie en tu hogar tiene vivienda propia. Te lo pide{" "}
          {firma.requested_by} para la postulación del {firma.comite_name}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {firma.signers.map((signer) =>
            signer.first_name === firstName ? (
              <Pill key={signer.first_name} tone={signer.signed ? "ok" : "alerta"}>
                {signer.signed ? "Firmaste" : "Tú"}
              </Pill>
            ) : (
              <Pill key={signer.first_name} tone={signer.signed ? "ok" : "neutro"}>
                {signer.first_name} {signer.signed ? "firmó" : "no ha firmado"}
              </Pill>
            ),
          )}
        </div>
      </Card>

      <Card className="mt-4 shadow-sm">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primario-claro font-mono text-xs text-primario">
          CU
        </span>
        <h2 className="mt-3 text-xl font-semibold">Firma con tu ClaveÚnica</h2>
        <p className="mt-2 text-sm text-suave">
          Te llevamos al sitio de ClaveÚnica. Ahí confirmas que eres tú y vuelves aquí. Nunca vemos ni guardamos tu clave.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {[
            "No tienes que imprimir ni ir a ninguna oficina",
            "Tu firma queda en la carpeta de tu familia",
            "Al firmar, el comité ve que la carpeta está lista",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ok" />
              {item}
            </li>
          ))}
        </ul>
        {firma.already_signed ? (
          <>
            <p role="status" className="mt-4 rounded-2xl bg-ok-claro py-3 text-center text-sm font-medium text-ok">
              Tu firma quedó en la carpeta. ¡Gracias!
            </p>
            <UndoButton />
          </>
        ) : (
          <>
            <SignButton />
            <Link href="/" className={`mt-2 ${BUTTON.secondary}`}>
              Ahora no
            </Link>
          </>
        )}
      </Card>

      {firma.observation_number !== null && (
        <section className="mt-4 rounded-3xl bg-primario-claro p-4 text-sm text-primario">
          <p className="font-mono text-[11px] uppercase tracking-wider">Tu firma destraba al grupo</p>
          <p className="mt-1">
            Es lo último que falta para responder la observación {firma.observation_number} del SERVIU. Las{" "}
            {firma.family_count} familias del comité están esperando esta respuesta.
          </p>
        </section>
      )}
    </main>
  );
}
