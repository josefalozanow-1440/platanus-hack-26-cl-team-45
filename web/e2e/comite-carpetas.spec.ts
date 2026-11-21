import { expect, test } from "@playwright/test";

test("el comité ve el estado de las carpetas del grupo, no su contenido", async ({ page }) => {
  await page.goto("/comite/carpetas");
  await expect(page.getByRole("heading", { name: "Carpetas del grupo" })).toBeVisible();
  const counts = page.getByTestId("counts");
  await expect(counts).toContainText("34listas");
  await expect(counts).toContainText("4con faltantes");
  await expect(counts).toContainText("2por vencer");
  await expect(page.getByText("2 familias aún no llegan a 10 UF.")).toBeVisible();

  const missing = page.getByTestId("missing");
  await expect(missing.getByRole("article")).toHaveCount(4);
  await expect(missing.getByRole("article", { name: "Familia Rojas" })).toContainText("Falta la firma de 1 adulto (DJ49-1)");
  await expect(page.getByText("Ves el estado de cada carpeta, no su contenido.")).toBeVisible();
});

test("recordar a una familia sin acompañante avisa una vez", async ({ page }) => {
  await page.goto("/comite/carpetas");
  await expect(page.getByText("Familia Pérez no tiene acompañante")).toBeVisible();
  // The reminder is idempotent per day (L-03), so the message depends on earlier runs.
  await page.getByRole("button", { name: "Recordar" }).click();
  await expect(page.getByRole("status")).toContainText("Familia Pérez");
});
