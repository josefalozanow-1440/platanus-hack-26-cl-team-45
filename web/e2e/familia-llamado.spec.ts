import { expect, test } from "@playwright/test";

test("F6: Folio le explica a la familia qué cambió con el llamado", async ({ page }) => {
  await page.goto("/familia/llamado");
  await expect(page.getByRole("heading", { name: "Cambiaron las reglas de tu postulación" })).toBeVisible();
  await expect(page.getByText("Te faltan 5 UF")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cómo completar mi ahorro" })).toBeVisible();
});
