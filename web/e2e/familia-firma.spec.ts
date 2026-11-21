import { expect, test } from "@playwright/test";

// Does not sign: other specs expect Pedro's signature to be pending.
test("F4: Pedro ve qué va a firmar y para qué", async ({ page }) => {
  await page.goto("/familia/firma");
  await expect(page.getByText("Pedro Rojas · 19 años")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Declaración de núcleo familiar (DJ49-1)" })).toBeVisible();
  await expect(page.getByText("Nunca vemos ni guardamos tu clave.", { exact: false })).toBeVisible();
  await expect(page.getByText("Tu firma destraba al grupo")).toBeVisible();
});
