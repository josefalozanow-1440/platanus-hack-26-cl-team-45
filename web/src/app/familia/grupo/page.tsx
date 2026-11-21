// F3 · Familia · Cómo va tu grupo
import { Card, Pill, type Tone } from "@/components/ui";
import { apiGet } from "@/lib/api";

import type { Grupo, StepStatus } from "../types";
import { FamilyNav, ScreenTitle } from "../ui";

const STEP_LABELS: Record<StepStatus, { label: string; tone: Tone; dot: string }> = {
  listo: { label: "Listo", tone: "ok", dot: "bg-ok" },
  ahora: { label: "Ahora", tone: "info", dot: "bg-primario" },
  pendiente: { label: "Pendiente", tone: "neutro", dot: "bg-linea" },
  seguimiento: { label: "Seguimiento", tone: "neutro", dot: "bg-linea" },
};

const TIME_FORMAT = new Intl.RelativeTimeFormat("es-CL", { numeric: "auto" });
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < MINUTES_PER_HOUR) return TIME_FORMAT.format(-minutes, "minute");
  if (minutes < MINUTES_PER_DAY) return TIME_FORMAT.format(-Math.round(minutes / MINUTES_PER_HOUR), "hour");
  return TIME_FORMAT.format(-Math.round(minutes / MINUTES_PER_DAY), "day");
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export default async function GrupoPage() {
  const grupo = await apiGet<Grupo>("/familia/grupo");
  return (
    <main>
      <ScreenTitle eyebrow={`${grupo.comite_name} · ${grupo.family_count} familias`}>Cómo va tu grupo</ScreenTitle>

      <section className="rounded-3xl bg-primario p-5 text-white">
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/70">
          Etapa {grupo.stage_number} de {grupo.stage_total} · {grupo.stage_name}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug">
          El SERVIU envió {grupo.observations_total} observaciones. La entidad responde todo junto.
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {grupo.business_days_left !== null && (
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-2xl font-semibold" data-testid="business-days-left">
                {grupo.business_days_left}
              </p>
              <p className="text-xs text-white/80">días hábiles para responder</p>
            </div>
          )}
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-2xl font-semibold">{grupo.observations_for_family}</p>
            <p className="text-xs text-white/80">
              {grupo.observations_for_family === 1 ? "observación es de tu familia" : "observaciones son de tu familia"}
            </p>
          </div>
        </div>
      </section>

      <Card className="mt-4">
        <h2 className="font-semibold">El camino del grupo</h2>
        <ol className="mt-3 space-y-3">
          {grupo.steps.map((step) => {
            const style = STEP_LABELS[step.status];
            return (
              <li key={step.stage} className="flex items-center gap-3 text-sm">
                <span className={`size-2.5 rounded-full ${style.dot}`} />
                <span className={`flex-1 ${step.status === "ahora" ? "font-semibold" : ""}`}>{step.name}</span>
                <Pill tone={style.tone}>{style.label}</Pill>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-suave">
          Obra, recepción y entrega las gestionan la entidad, la constructora, la municipalidad y el SERVIU. Aquí ves su
          avance.
        </p>
      </Card>

      <section className="mt-4 rounded-3xl bg-aviso-claro p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-aviso">Tiempo de espera del grupo</p>
        <p className="mt-1 text-2xl font-semibold" data-testid="wait-time">
          {plural(grupo.wait_years, "año", "años")} y {plural(grupo.wait_months, "mes", "meses")}
        </p>
        <p className="mt-1 text-xs text-suave">
          Desde que el comité se organizó. Ningún sistema público lo registra hoy; aquí queda guardado.
        </p>
      </section>

      <Card className="mt-4">
        <h2 className="font-semibold">Actividad del grupo</h2>
        <ul className="mt-3 space-y-3">
          {grupo.activities.map((activity) => (
            <li key={activity.text} className="flex gap-3">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primario-claro text-[10px] font-semibold text-primario">
                {activity.initials}
              </span>
              <div>
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-suave">{timeAgo(activity.occurred_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <FamilyNav current="/familia/grupo" />
    </main>
  );
}
