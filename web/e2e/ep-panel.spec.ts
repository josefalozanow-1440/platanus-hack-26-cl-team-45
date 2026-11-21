import { expect, test } from "@playwright/test";

test("el panel de la EP muestra los 4 comités y lleva a sus pantallas", async ({ page }) => {
  await page.goto("/ep/panel");
  await expect(page.getByRole("heading", { name: "Panel de grupos" })).toBeVisible();
  await expect(page.getByText("128 de 148")).toBeVisible();
  await expect(page.getByText("4 comités · 148 familias")).toBeVisible();
  const villa = page.getByTestId("fila-villa-nueva");
  await expect(villa.getByText("Quedan 37 de 180 días")).toBeVisible();

  await page.getByTestId("fila-los-aromos").getByRole("link", { name: /pendiente/ }).click();
  await expect(page).toHaveURL(/\/ep\/observaciones\?comite=los-aromos/);

  await page.getByRole("link", { name: "Panel de grupos" }).click();
  await villa.getByRole("link", { name: "Comité Villa Nueva" }).click();
  await expect(page).toHaveURL(/\/ep\/carpeta\/villa-nueva/);
});
