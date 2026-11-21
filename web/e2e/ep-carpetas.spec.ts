import { expect, test } from "@playwright/test";

test("las carpetas del grupo muestran las familias y el panel de Folio", async ({ page }) => {
  await page.goto("/ep/carpetas");
  await expect(page.getByRole("heading", { name: "Carpetas del grupo" })).toBeVisible();
  await expect(page.getByRole("article", { name: "Familia Pérez" })).toContainText("Sin acompañante");
  await expect(page.getByRole("complementary", { name: "Folio" })).toContainText("Estado del grupo hoy");
});
