import { expect, test } from "@playwright/test";

test("la home muestra que la API y la base funcionan", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Comité" })).toBeVisible();
  await expect(page.getByTestId("api-status")).toHaveText("funciona");
  await expect(page.getByTestId("db-status")).toHaveText("funciona");
});
