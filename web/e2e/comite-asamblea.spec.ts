import { expect, test } from "@playwright/test";

test("A1: la asamblea muestra la votación y confirma el voto elegido", async ({ page }) => {
  await page.goto("/comite/asamblea");
  await expect(page.getByRole("heading", { name: "¿Aprobamos la tipología de vivienda?", level: 1 })).toBeVisible();
  await expect(page.getByText("Quórum alcanzado")).toBeVisible();
  await expect(page.getByRole("radio", { name: "De acuerdo" })).toBeChecked();
  await page.getByRole("radio", { name: "Me abstengo" }).check();
  await page.getByRole("button", { name: "Confirmar mi voto" }).click();
  await expect(page.getByRole("status")).toHaveText("Tu voto quedó registrado: Me abstengo");
});
