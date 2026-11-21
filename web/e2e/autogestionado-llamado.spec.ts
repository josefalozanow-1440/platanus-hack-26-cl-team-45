import { expect, test } from "@playwright/test";

test("Folio muestra las 9 reglas del llamado y lleva a aplicarlas", async ({ page }) => {
  await page.goto("/autogestionado/llamado");
  await expect(page.getByRole("heading", { name: "Folio leyó el llamado" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Aceptar" })).toHaveCount(9);
  await expect(page.getByText("resuelvo 10.2")).toBeVisible();

  await page.getByRole("link", { name: "Aplicar 9 reglas a las 38 familias" }).click();
  await expect(page).toHaveURL(/\/autogestionado\/llamado\/aplicadas/);
});
