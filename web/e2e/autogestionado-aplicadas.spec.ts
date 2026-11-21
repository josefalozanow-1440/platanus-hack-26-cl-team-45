import { expect, test } from "@playwright/test";

test("las reglas aplicadas muestran el camino del grupo y vuelven a las reglas", async ({ page }) => {
  await page.goto("/autogestionado/llamado/aplicadas");
  await expect(page.getByRole("heading", { name: "Así queda el camino del grupo" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Camino del grupo" })).toContainText("antes por puntaje");
  await expect(page.getByText("35 familias: nada cambia en su carpeta")).toBeVisible();

  await page.getByRole("link", { name: "Ver reglas" }).click();
  await expect(page).toHaveURL(/\/autogestionado\/llamado$/);
});
