import { expect, test } from "@playwright/test";

test("I1: Marta ve el código y el enlace para invitar a Pedro a firmar", async ({ page }) => {
  await page.goto("/familia/invitar");
  await expect(page.getByRole("heading", { name: "Pedro necesita firmar", level: 1 })).toBeVisible();
  await expect(page.getByRole("img", { name: "Código QR de la invitación" })).toBeVisible();
  await expect(page.getByText("folio.cl/i/rojas-7K2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar por WhatsApp" })).toBeVisible();
});
