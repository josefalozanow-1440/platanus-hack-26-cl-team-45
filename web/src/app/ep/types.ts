// Mirrors api/app/schemas/ep.py.
export type Stage = "organizacion" | "proyecto" | "revision_serviu" | "calificado" | "subsidio_asignado" | "entrega";
export type DocumentKind = "rsh" | "cedula" | "dj49_1" | "dj49_2" | "dj49_3" | "ahorro" | "comunidad";
export type DocumentStatus = "listo" | "falta" | "vence" | "no_aplica";
export type ObservationCategory = "tecnica" | "presupuesto" | "familias";

export type Deadline = {
  kind: string;
  title: string;
  due_on: string;
  business_days: boolean;
  remaining_days: number;
  total_days: number | null;
  article: string | null;
  note: string | null;
  critical: boolean;
};

export type PanelRow = {
  slug: string;
  name: string;
  stage: Stage;
  folders: { complete: number; missing: number; expiring: number; total: number };
  deadlines: Deadline[];
  observations: { answered: number; total: number; pending_assignee: string | null; last_answered: string | null };
  wait_months: number;
};

export type Panel = {
  ep_name: string;
  comite_count: number;
  family_count: number;
  families_complete: number;
  critical_deadlines: number;
  observations_answered: number;
  observations_total: number;
  average_wait_months: number;
  comites: PanelRow[];
};

export type Observation = {
  id: number;
  number: number;
  category: ObservationCategory;
  description: string;
  assignee_role: string | null;
  assignee_name: string | null;
  draft_answer: string | null;
  draft_accepted_by: string | null;
  note: string | null;
  answered: boolean;
};

export type ObservationsPage = {
  slug: string;
  name: string;
  round: number;
  received_on: string | null;
  deadline: Deadline | null;
  observations: Observation[];
  answered: number;
  family_message: string;
};

export type Carpeta = {
  slug: string;
  name: string;
  stage: Stage;
  family_count: number;
  missing: number;
  deadline: Deadline | null;
  families: { id: number; name: string; documents: Partial<Record<DocumentKind, DocumentStatus>> }[];
  composition: { in_rsh_40: number; total: number; share_percent: number; compliant: boolean };
  next_assembly: Deadline | null;
};
