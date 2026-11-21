"use server";

import { revalidatePath } from "next/cache";

import { apiSend } from "@/lib/api";

// shortcut: no login yet, so whoever accepts from the EP screens is recorded as the EP team.
const EP_ACTOR = "Equipo EP";

export async function acceptDraft(formData: FormData) {
  await apiSend(`/ep/observaciones/${formData.get("id")}/aceptar`, "POST", { accepted_by: EP_ACTOR });
  revalidatePath("/ep", "layout");
}

export type ReminderState = { families: number } | null;

export async function requestReminders(_state: ReminderState, formData: FormData): Promise<ReminderState> {
  return apiSend<{ families: number }>(`/ep/comites/${formData.get("slug")}/recordatorios`, "POST");
}
