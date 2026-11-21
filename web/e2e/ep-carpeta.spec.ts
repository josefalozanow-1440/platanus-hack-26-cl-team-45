import { expect, test } from "@playwright/test";

test("la carpeta de Villa Nueva muestra el plazo del art. 12 y la matriz de documentos", async ({ page }) => {
  await page.goto("/ep/carpeta/villa-nueva");
  await expect(page.getByRole("heading", { name: /Carpeta del grupo · .*Villa Nueva/ })).toBeVisible();
  await expect(page.getByTestId("plazo-carpeta")).toContainText("Quedan 37 de 180 días");
  await expect(page.getByTestId("plazo-carpeta")).toContainText("Faltan 14 carpetas");
  await expect(page.getByRole("row", { name: /Familia Herrera/ })).toContainText("Falta");
  await expect(page.getByTestId("composicion")).toContainText("23 de 32 familias (72%)");
  await expect(page.getByRole("button", { name: "Enviar recordatorio a las familias con faltantes" })).toBeVisible();
});
