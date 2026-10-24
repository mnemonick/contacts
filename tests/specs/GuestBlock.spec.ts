import { expect, test } from "@playwright/test";
import { registerUser } from "$/utils.ts";

test.describe("GuestBlock", () => {
  test("modal closes on backdrop click but not on click inside", async ({ page }) => {
    await page.goto("/");
    await page.locator("register-button").click();

    await page.locator("register-modal heading").click();
    await expect(page.locator("register-modal")).toBeVisible();

    await page.locator("register-modal").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("register-modal")).toBeHidden();
  });

  test("a signed-in user opening the guest page is redirected to the contacts page", async ({ page }) => {
    await registerUser(page);

    await page.goto("/");

    await expect(page).toHaveURL(/\/user$/);
  });

  test("unknown route shows the 404 page", async ({ page }) => {
    await page.goto("/no-such-page");
    await expect(page.locator("not-found")).toContainText("404");
    await expect(page.locator("not-found")).toContainText("This page doesn't exist");
  });
});
