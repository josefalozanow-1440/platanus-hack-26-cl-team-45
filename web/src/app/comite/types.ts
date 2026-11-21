// Mirrors api/app/schemas/comite.py.
import type { Deadline } from "@/app/ep/types";

export type MissingFolder = {
  id: number;
  name: string;
  done: number;
  total: number;
  missing_label: string;
  companion_name: string | null;
};

export type ComiteCarpetas = {
  slug: string;
  name: string;
  counts: { complete: number; missing: number; expiring: number; total: number };
  composition: { in_rsh_40: number; total: number; share_percent: number; compliant: boolean };
  savings_cutoff: { deadline: Deadline; below_minimum: number } | null;
  missing: MissingFolder[];
  hidden: number;
};

export type ReminderSent = { family: string; sent: boolean };

export type WaitlistFamily = {
  id: number;
  name: string;
  in_rsh_40: boolean;
  savings_ready: boolean;
  can_enter: boolean;
  blocker: string | null;
  proposed: boolean;
};

export type ComiteReemplazo = {
  slug: string;
  name: string;
  renunciation: { family_id: number; name: string; renounced_on: string } | null;
  deadline: Deadline | null;
  requirements: { label: string; key: boolean }[];
  effect: { active: number; above_rsh_40: number; percent_if_above: number; compliant_if_above: boolean };
  waitlist: WaitlistFamily[];
};
