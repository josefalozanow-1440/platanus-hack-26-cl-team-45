import { expect, test } from "@playwright/test";

test("la página de estado muestra CI, commits y los ítems del proyecto", async ({ page }) => {
  await page.goto("/estado");
  await expect(page.getByRole("heading", { name: "Estado del proyecto", level: 1 })).toBeVisible();
  await expect(page.getByTestId("ci-status")).toContainText(/Todo pasa|CI roto|Corriendo|Sin datos/);
  for (const name of ["Integración continua", "Últimos cambios", "Producto", "Ingeniería"]) {
    await expect(page.getByRole("heading", { name, level: 2 })).toBeVisible();
  }
});
