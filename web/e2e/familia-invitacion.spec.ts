import { expect, test } from "@playwright/test";

test("I2: Pedro abre la invitación y sigue a la firma", async ({ page }) => {
  await page.goto("/familia/invitacion");
  await expect(page.getByRole("heading", { name: "Marta te invitó a la carpeta de tu familia", level: 1 })).toBeVisible();
  await expect(page.getByText("Falta solo tu firma")).toBeVisible();
  await expect(page.getByLabel("¿Cómo te llamas?")).toHaveValue("Pedro Rojas");
  await page.getByRole("link", { name: "Continuar y firmar con ClaveÚnica" }).click();
  await expect(page).toHaveURL(/\/familia\/firma$/);
});
