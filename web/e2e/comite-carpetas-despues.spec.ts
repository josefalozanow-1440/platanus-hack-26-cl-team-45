import { expect, test } from "@playwright/test";

test("C1b: después de la firma, la Familia Rojas pasa a por vencer", async ({ page }) => {
  await page.goto("/comite/carpetas/despues");
  await expect(page.getByRole("heading", { name: "Carpetas del grupo" })).toBeVisible();
  await expect(page.getByText("La Familia Rojas pasó a amarillo: solo le falta el ahorro.")).toBeVisible();
  await expect(page.getByText("Folio avisó a Marta y a la entidad")).toBeVisible();
  await expect(page.getByTestId("expiring").getByRole("article", { name: "Familia Rojas" })).toContainText("6 / 7");
});
