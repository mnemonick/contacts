import { expect, test } from "@playwright/test";

test("shows the minimum width message below 360px", async ({ page }) => {
  await page.setViewportSize({ width: 359, height: 800 });
  await page.goto("/");

  await expect(page.locator("too-narrow message")).toHaveText("The minimum supported width is 360px.");
  await expect(page.locator("register-button")).toBeHidden();
});

test("shows the page at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  await expect(page.locator("too-narrow")).toBeHidden();
  await expect(page.locator("register-button")).toBeVisible();
});
