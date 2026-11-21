# Domain models and seed (contract for the screen builders)

All models live in `app/models/domain.py` and are re-exported from `app.models`. Enums (`StrEnum`, stored as their lowercase value) live in the same file: import them from `app.models.domain`. Migration: `alembic/versions/96e4fb8cfd81_domain_models.py`. Do not add columns without a new migration; ask golazo#44-1 if you need one.

## Models

| Model (table) | Key fields | Relationships |
| --- | --- | --- |
| `EntidadPatrocinante` (`entidades_patrocinantes`) | `name` | `comites` |
| `Comite` (`comites`) | `slug` (URL key: `los-aromos`, `villa-nueva`, `las-palmas`, `los-robles`), `name` ("Comité Los Aromos"), `stage: Stage`, `organized_on: date` (waiting time = today − organized_on) | `ep`, `families`, `deadlines` (by `due_on`), `observations` (by `number`), `activities` (newest first) |
| `Family` (`families`) | `surname` ("Rojas"; `display_name` property = "Familia Rojas"), `contact_name`, `in_rsh_40: bool` (in the 40% most vulnerable of the RSH, composition rule art. 1), `savings_uf: Decimal`, `companion_name` (acompañante from the comité, null = sin acompañante), consent toggles `shares_with_comite`, `shares_with_ep`, `shares_sensitive`, `renounced_at`, `waitlisted_at` | `comite`, `members`, `documents` |
| `Member` (`members`) | `first_name`, `age` (adult = age >= 18) | `family` |
| `Document` (`documents`) | `kind: DocumentKind`, `status: DocumentStatus`, `detail` (short line under the name, e.g. "Vence 03-02-2027"). Unique per (family, kind): every family has exactly the 7 kinds. | `family`, `signatures` |
| `Signature` (`signatures`) | `member_id`, `signed_at` (null = pending) | `document`, `member` |
| `Deadline` (`deadlines`) | `kind: DeadlineKind`, `title`, `starts_on` (nullable; with `due_on` gives "quedan X de Y días"), `due_on`, `business_days: bool`, `article` ("art. 12"), `note` | `comite` |
| `Observation` (`observations`) | `round`, `number`, `category: ObservationCategory`, `description`, `received_on`, `assignee_role` ("Arquitecta"), `assignee_name` ("Carla Ibáñez"), `family_id` (nullable), `draft_answer`, `draft_accepted_by` (null = draft not accepted yet), `note`, `answered_at` (null = pending) | `comite`, `family` |
| `Activity` (`activities`) | `actor` ("Copiloto", "Ana Muñoz", "Entidad", "Valentina Soto"), `text`, `occurred_at` | `comite` |

Enums:

- `Stage`: `organizacion`, `proyecto`, `revision_serviu`, `calificado`, `subsidio_asignado`, `entrega` (the 6 steps of F3, in order). E1 labels: Organización, Proyecto, Revisión SERVIU, Calificado, Subsidio asignado, Entrega.
- `DocumentKind`: `rsh`, `cedula`, `dj49_1`, `dj49_2`, `dj49_3`, `ahorro`, `comunidad`.
- `DocumentStatus`: `listo`, `falta`, `vence`, `no_aplica` (comunidad is `no_aplica` for most families; E3 shows it as "—").
- `DeadlineKind`: `observaciones`, `proyecto`, `calificacion`, `reemplazo`, `obras`, `ahorro`, `asamblea`.
- `ObservationCategory`: `tecnica`, `presupuesto`, `familias`.

## Counting rules the seed was built for

- Active family: `renounced_at is None and waitlisted_at is None`. Counts like "de 40" use active families only.
- Complete carpeta: no document in `falta` or `vence`.
- Family bucket (C1): any `falta` → con faltantes; else any `vence` → por vencer; else lista.
- Carpeta progress "5 / 7": documents in `listo` or `no_aplica`, over 7.
- Composition: share of active families with `in_rsh_40 = False` (max 30%).

## What the seed contains (`app/seed.py`, idempotent, runs on API start)

EP "Entidad Patrocinante Sur" with 4 comités and 148 active families; 128 complete.

- **Los Aromos** (`los-aromos`, `revision_serviu`, organized 2023-07-21): 40 active, 34 complete, 11 above 40% RSH.
  - Con faltantes: Rojas (5/7, DJ49-1 falta, ahorro vence 9,5 UF, acompaña Valentina, contacto Marta Rojas), Pérez (6/7, falta mandato DJ49-3, sin acompañante), Herrera (4/7, acompaña Jorge), Castro (5/7, RSH falta + cédula vence, acompaña Ana).
  - Por vencer: Soto (cédula), Díaz (ahorro 8 UF). Under 10 UF: Rojas and Díaz.
  - Muñoz (Ana Muñoz) complete. Vera renounced (above 40% RSH). Waiting list: Fuentes (7 UF, ahorro falta), Tapia (10 UF, puede entrar), both in the 40%.
  - Rojas members: Marta 44, Pedro 19, Sofía 22, Tomás 9. DJ49-1 signatures: Marta and Sofía signed, Pedro pending.
  - Deadlines: observaciones (12-11-2026 → 05-02-2027, business days, art. 13 inc. 3), ahorro corte 31-12-2026 (art. 39), reemplazo 13-03-2027 (arts. 14 y 20).
  - Observations round 1 (received 12-11-2026): 1 técnica (Arquitecta Carla Ibáñez, answered, draft accepted), 2 presupuesto (Equipo EP Jorge Lagos, answered, draft accepted), 3 familias (Familia Rojas · Marta Rojas, pending, draft not accepted, note about reminder and Valentina).
  - 4 activities (Copiloto avisó..., Ana Muñoz completó..., La entidad respondió la observación 2, Valentina se ofreció...).
- **Villa Nueva** (`villa-nueva`, `organizacion`, organized 2024-10-21): 32 active, 18 complete, 23 in the 40% (72%). Named families matching E3: Araya, Bravo, Castro, Godoy, Herrera, Jara, León. Deadlines: proyecto 01-07-2026 → 28-12-2026 (art. 12), asamblea 28-11-2026 (Res. 1.875, 70% asistencia).
- **Las Palmas** (`las-palmas`, `calificado`, organized 2022-04-21): 40/40 complete. Deadlines: calificación 14-03-2027, reemplazo 13-03-2027.
- **Los Robles** (`los-robles`, `subsidio_asignado`, organized 2021-09-21): 36/36 complete. Deadline: inicio de obras 23-09-2026 → 22-12-2026 (art. 57, note about permiso DOM). Observation 1 (reemplazo de 1 familia, answered). So EP-wide: 3 of 4 observations answered.

Generated families get surnames from a fixed pool; their order and data are deterministic. In tests, call `seed(session)` (it returns False if the data is already in the dev DB) and query by slug and surname.

## Shared helpers

`app/services/dates.py`: `days_left(today, due_on)`, `business_days_left(today, due_on)` (weekdays minus a fixed holiday set) and `elapsed(since, today)` → `Elapsed(years, months)`. Services take `today: date` as a parameter so tests can fix it; routers pass `date.today()`.
