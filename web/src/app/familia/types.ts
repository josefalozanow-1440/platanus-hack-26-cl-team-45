// Mirrors api/app/schemas/familia.py.
export type DocumentStatus = "listo" | "falta" | "vence" | "no_aplica";
export type StepStatus = "listo" | "ahora" | "pendiente" | "seguimiento";

export type Progress = { ready: number; total: number; listos: number; por_vencer: number; faltan: number };
export type Person = { name: string; initials: string };
export type Signer = { first_name: string; signed: boolean };

type FamilyHeader = { family_name: string; contact_name: string | null; comite_name: string; member_count: number };

export type Carpeta = FamilyHeader & {
  progress: Progress;
  pending_action: { title: string; body: string; member_name: string } | null;
  documents: { kind: string; code: string; name: string; detail: string | null; status: DocumentStatus; status_label: string }[];
  family_access: Person[];
  others_access: Person[];
  dj49_1_signers: Signer[];
  savings_cutoff: { due_on: string; days_left: number; savings_uf: string; required_uf: string } | null;
  comite_progress: { complete: number; total: number };
};

export type PrivacySettings = { shares_with_comite: boolean; shares_with_ep: boolean; shares_sensitive: boolean };
export type Privacy = FamilyHeader & { ep_name: string; progress: Progress; settings: PrivacySettings };

export type Grupo = {
  comite_name: string;
  family_count: number;
  stage_number: number;
  stage_total: number;
  stage_name: string;
  observations_total: number;
  observations_for_family: number;
  business_days_left: number | null;
  steps: { stage: string; name: string; status: StepStatus }[];
  wait_years: number;
  wait_months: number;
  activities: { actor: string; initials: string; text: string; occurred_at: string }[];
};

export type Firma = {
  signer_name: string;
  signer_age: number;
  requested_by: string;
  comite_name: string;
  lives_with: string[];
  signers: Signer[];
  already_signed: boolean;
  observation_number: number | null;
  family_count: number;
};
