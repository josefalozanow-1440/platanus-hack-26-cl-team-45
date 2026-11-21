import { expect, test } from "@playwright/test";

test("F2: la carpeta de la familia Rojas muestra sus documentos y el avance del comité", async ({ page }) => {
  await page.goto("/familia/carpeta");
  await expect(page.getByRole("heading", { name: "Familia Rojas", level: 1 })).toBeVisible();
  await expect(page.getByTestId("carpeta-progress")).toHaveText(/\d \/ 7/);
  await expect(page.getByText("Registro Social de Hogares")).toBeVisible();
  await expect(page.getByText("Faltan 0,5 UF")).toBeVisible();
  await expect(page.getByTestId("comite-progress")).toHaveText(/\d+ \/ 40/);
});
