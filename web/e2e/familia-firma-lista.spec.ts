import { expect, test } from "@playwright/test";

test("F5: Pedro ve que su firma quedó lista y qué cambió", async ({ page }) => {
  await page.goto("/familia/firma/lista");
  await expect(page.getByRole("heading", { name: "Listo, firmaste" })).toBeVisible();
  await expect(page.getByText("Marta recibió el aviso de que firmaste")).toBeVisible();
  await page.getByRole("link", { name: "Ver cómo va el grupo" }).click();
  await expect(page).toHaveURL(/\/familia\/grupo$/);
});
