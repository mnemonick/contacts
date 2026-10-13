import { expect, test } from "@playwright/test";
import { API, registerUser } from "$/utils.ts";

test.describe("ErrorScreen", () => {
  test("a rendering error shows the error screen instead of a blank page, and reload recovers", async ({ page }) => {
    const credentials = await registerUser(page);
    // A malformed server response (contacts is not a list) breaks rendering of the contacts page.
    await page.route(`${API}/get-user`, (route) =>
      route.fulfill({
        json: {
          error: null,
          user: { ...credentials, registration: "2026-01-01T00:00:00.000Z", contacts: null }
        }
      })
    );

    await page.reload();

    await expect(page.locator("error-screen heading")).toHaveText("Something went wrong");

    await page.unroute(`${API}/get-user`);
    await page.locator("reload-button").click();

    await expect(page.locator("username")).toHaveText(new RegExp(credentials.username));
  });
});
