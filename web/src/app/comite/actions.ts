"use server";

import { revalidatePath } from "next/cache";

import { apiSend } from "@/lib/api";

import type { ReminderSent } from "./types";
import { DEMO_COMITE } from "./ui";

// shortcut: no login yet, so "yo" in the comité screens is always Valentina from the directiva.
const DEMO_USER = "Valentina";

export async function accompany(familyId: number) {
  await apiSend(`/comite/${DEMO_COMITE}/familias/${familyId}/acompanante`, "POST", { companion_name: DEMO_USER });
  revalidatePath("/comite/carpetas");
}

export async function remind(familyId: number): Promise<ReminderSent> {
  return apiSend<ReminderSent>(`/comite/${DEMO_COMITE}/familias/${familyId}/recordatorio`, "POST");
}

export async function propose(familyId: number) {
  await apiSend(`/comite/${DEMO_COMITE}/reemplazo/propuesta`, "POST", { family_id: familyId });
  revalidatePath("/comite/reemplazo");
}
