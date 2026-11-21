import { expect, test } from "@playwright/test";

test("la home deja elegir pantalla y muestra que la API y la base funcionan", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Comité", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mi carpeta/ })).toHaveAttribute("href", "/familia/carpeta");
  await expect(page.getByTestId("api-status")).toHaveText("funciona");
  await expect(page.getByTestId("db-status")).toHaveText("funciona");
});
