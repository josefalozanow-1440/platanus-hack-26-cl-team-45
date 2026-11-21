import { expect, test } from "@playwright/test";

test("la directiva ve el plazo, los requisitos y la lista de espera para reemplazar", async ({ page }) => {
  await page.goto("/comite/reemplazo");
  await expect(page.getByRole("heading", { name: "Familia Vera renunció" })).toBeVisible();
  await expect(page.getByTestId("replace-deadline")).toHaveText("13-03-2027");
  await expect(page.getByText("Ahorro de 10 UF ya depositado")).toBeVisible();

  const waitlist = page.getByTestId("waitlist");
  await expect(waitlist.getByRole("article", { name: "Familia Fuentes" })).toContainText("Falta ahorro");
  await expect(waitlist.getByRole("article", { name: "Familia Tapia" })).toContainText(/Puede entrar|Propuesta/);
  // Only a family that can enter is offered to the assembly; the amount of savings is never shown (L-06).
  await expect(page.getByText("7 UF")).toHaveCount(0);
});
