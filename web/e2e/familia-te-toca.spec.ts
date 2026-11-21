import { expect, test } from "@playwright/test";

test("B1: la familia ve lo que le toca hacer y las menciones", async ({ page }) => {
  await page.goto("/familia/te-toca");
  await expect(page.getByRole("heading", { name: "Te toca", exact: true })).toBeVisible();
  await expect(page.getByText("Asamblea: ¿aprobamos la tipología de vivienda?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Votar" })).toHaveAttribute("href", "/comite/asamblea");
  await expect(page.getByText("Pedro abrió tu invitación")).toBeVisible();
});
