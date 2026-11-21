import { expect, test } from "@playwright/test";

test("después de la firma las 3 observaciones de Los Aromos quedan respondidas", async ({ page }) => {
  await page.goto("/ep/observaciones/despues");
  await expect(page.getByRole("heading", { name: "Observaciones del SERVIU · Los Aromos" })).toBeVisible();
  await expect(page.getByText("Pedro Rojas firmó la DJ49-1 con ClaveÚnica")).toBeVisible();
  await expect(page.getByTestId("respuesta-progreso")).toHaveText("3 de 3 observaciones listas · lista para ingresar");
  await expect(page.getByTestId("observacion-3")).toContainText("Respondida");
});
