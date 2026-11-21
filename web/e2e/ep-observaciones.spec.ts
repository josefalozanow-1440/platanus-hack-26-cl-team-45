import { expect, test } from "@playwright/test";

// Read-only on purpose: accepting a draft would change the shared demo data.
test("las observaciones de Los Aromos muestran el plazo y la respuesta única", async ({ page }) => {
  await page.goto("/ep/observaciones");
  await expect(page).toHaveURL(/comite=los-aromos/);
  await expect(page.getByRole("heading", { name: /Observaciones del SERVIU · .*Los Aromos/ })).toBeVisible();
  await expect(page.getByTestId("plazo-observaciones")).toContainText("Vence el 05-02-2027");
  await expect(page.getByTestId("observacion-1")).toContainText("Borrador del Folio aceptado por Carla Ibáñez");
  await expect(page.getByTestId("observacion-3").getByRole("button", { name: "Aceptar" })).toBeVisible();
  await expect(page.getByText("no enviamos nada al SERVIU")).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: /Descargar/ }).click();
  expect((await download).suggestedFilename()).toBe("respuesta-los-aromos.txt");
});
