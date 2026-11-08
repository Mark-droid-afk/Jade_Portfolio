import { expect, test } from "@playwright/test";

test("welcome page moves on to the homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome to the portfolio of")).toBeVisible();
  await page.waitForURL("**/home", { timeout: 10_000 });
});

test("homepage basics", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mark Jade");
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeVisible();

  // theme toggle
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  // command palette
  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  await page.keyboard.press("Escape");

  // project details window
  await page.getByRole("button", { name: "View details for Votera" }).click();
  await expect(page.getByRole("dialog", { name: "Votera details" })).toBeVisible();
  await page.keyboard.press("Escape");

  // Gurrabot panel
  await page.getByRole("button", { name: "Ask Gurrabot" }).first().click();
  await expect(page.getByRole("dialog", { name: "Chat with Gurrabot" })).toBeVisible();
});

test("case study and notes pages", async ({ page }) => {
  await page.goto("/projects/votera");
  await expect(page.getByRole("heading", { level: 1, name: "Votera" })).toBeVisible();
  await page.goto("/notes/building-gurrabot");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gurrabot");
});

test("phones get the bottom tab bar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/home");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
});
