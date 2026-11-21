import { expect, test } from "@playwright/test";

test("C3: Folio le muestra a la directiva el plazo y el informe del grupo", async ({ page }) => {
  await page.goto("/comite/folio");
  await expect(page.getByRole("heading", { name: "Folio", exact: true })).toBeVisible();
  await expect(page.getByText("14-03-2027")).toBeVisible();
  await expect(page.getByText("Pérez, Herrera y Castro: faltan documentos")).toBeVisible();
  await expect(page.getByRole("link", { name: "¿Qué pasa si alguien renuncia?" })).toHaveAttribute("href", "/comite/reemplazo");
});
