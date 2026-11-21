import { expect, test } from "@playwright/test";

test("F0: la familia decide quién ve su carpeta y lo guarda", async ({ page }) => {
  await page.goto("/familia/privacidad");
  await expect(page.getByRole("heading", { name: "¿Quién ve tu carpeta?" })).toBeVisible();
  await expect(page.getByText("No ve el contenido.")).toBeVisible();

  const sensitive = page.getByRole("switch", { name: "Datos sensibles" });
  const before = await sensitive.getAttribute("aria-checked");
  await sensitive.click();
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByRole("status")).toHaveText("Listo, guardamos tus preferencias.");

  await page.reload();
  await expect(sensitive).not.toHaveAttribute("aria-checked", before ?? "");
  // Leave the toggle as it was.
  await sensitive.click();
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByRole("status")).toHaveText("Listo, guardamos tus preferencias.");
});
