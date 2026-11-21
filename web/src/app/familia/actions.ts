"use server";

import { revalidatePath } from "next/cache";

import { apiSend } from "@/lib/api";

import type { PrivacySettings } from "./types";

export async function savePrivacy(settings: PrivacySettings) {
  await apiSend("/familia/privacidad", "PUT", settings);
  revalidatePath("/familia", "layout");
}

export async function signDj49() {
  await apiSend("/familia/firma", "POST");
  revalidatePath("/familia", "layout");
}

export async function undoSignature() {
  await apiSend("/familia/firma", "DELETE");
  revalidatePath("/familia", "layout");
}
