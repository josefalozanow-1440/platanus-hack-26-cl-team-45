// F5 is a shell: fixed data until the API tells what changed after the signature.
import type { Tone } from "@/components/ui";

export const SIGNED = {
  signerName: "Pedro Rojas",
  confirmedAt: "10:41",
  comiteName: "Comité Los Aromos",
  familyName: "Familia Rojas",
  detail: "Solo falta completar el ahorro",
  progress: "6 / 7",
};

export const CHANGES: { initials: string; tone: Tone; text: string }[] = [
  { initials: "MR", tone: "alerta", text: "Marta recibió el aviso de que firmaste" },
  { initials: "VS", tone: "aviso", text: "El comité ve la carpeta de tu familia en amarillo: solo falta el ahorro" },
  { initials: "EP", tone: "info", text: "La entidad ya puede responder la observación 3 del SERVIU" },
];
