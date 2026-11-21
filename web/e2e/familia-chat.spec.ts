import { expect, test } from "@playwright/test";

test("F1: el copiloto revisa la carpeta y responde las preguntas rápidas", async ({ page }) => {
  await page.goto("/familia/chat");
  await expect(page.getByRole("heading", { name: "Copiloto de Carpeta" })).toBeVisible();
  await expect(page.getByText("Revisé tu carpeta parte por parte")).toBeVisible();
  await expect(page.getByText(/familias ya completaron su carpeta/)).toBeVisible();

  await page.getByRole("button", { name: "¿Qué es DJ49-1?" }).click();
  await expect(page.getByText(/declaración de núcleo familiar: dice quiénes viven contigo/)).toBeVisible();
});
