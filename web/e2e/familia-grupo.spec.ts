import { expect, test } from "@playwright/test";

test("F3: la familia ve la etapa del grupo, el camino y el tiempo de espera", async ({ page }) => {
  await page.goto("/familia/grupo");
  await expect(page.getByRole("heading", { name: "Cómo va tu grupo" })).toBeVisible();
  await expect(page.getByText("Etapa 3 de 6 · Revisión del SERVIU")).toBeVisible();
  await expect(page.getByText("Escritura y entrega")).toBeVisible();
  await expect(page.getByTestId("wait-time")).toHaveText(/\d+ años? y \d+ mes/);
  await expect(page.getByText("Valentina se ofreció a acompañar a la familia Pérez")).toBeVisible();
});
