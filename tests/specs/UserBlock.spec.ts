import { expect, test } from "@playwright/test";
import { API, addContact, logout, registerUser, sample } from "$/utils.ts";

test.describe("UserBlock", () => {
  test("empty comment is shown as '-'", async ({ page }) => {
    await registerUser(page);

    await addContact(page, { ...sample, comment: "" });

    await expect(page.locator("contact comment")).toHaveText("-");
    await page.reload();
    await expect(page.locator("contact comment")).toHaveText("-");
  });

  test("keeps unicode and emoji intact", async ({ page }) => {
    await registerUser(page);
    const unicode = { name: "Иван Петров 👋", email: "ivan@example.com", comment: "日本語のコメント" };

    await addContact(page, unicode);
    await page.reload();

    await expect(page.locator("contact name")).toHaveText(unicode.name);
    await expect(page.locator("contact comment")).toHaveText(unicode.comment);
  });

  test("renders contact data as text, not HTML", async ({ page }) => {
    await registerUser(page);
    const name = `<img src=x onerror="window.__xss = true">`;

    await addContact(page, { ...sample, name });
    await page.reload();

    await expect(page.locator("contact name")).toHaveText(name);
    expect(await page.evaluate(() => (window as unknown as { __xss?: boolean }).__xss)).toBeUndefined();
  });

  test("contacts are private to their owner", async ({ page }) => {
    await registerUser(page);
    await addContact(page, { ...sample, name: "Alice private contact" });
    await logout(page);

    await registerUser(page);

    await expect(page.getByText("No contacts")).toBeVisible();
    await expect(page.getByText("Alice private contact")).toHaveCount(0);
  });

  test("profile shows registration date and contacts count", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);
    await addContact(page, { ...sample, name: "Second" });

    await page.locator("username").click();

    const fields = page.locator("field");
    await expect(fields.nth(0)).toContainText("Registration date");
    await expect(fields.nth(0).locator("value")).toHaveText(/\d{4}/);
    // Registration is stored as a date, so no time of day is shown.
    await expect(fields.nth(0).locator("value")).not.toContainText(":");
    await expect(fields.nth(1).locator("value")).toHaveText("2");
  });

  test("logout clears credentials and the contacts page is no longer accessible", async ({ page }) => {
    await registerUser(page);

    await logout(page);

    await page.goto("/user");
    await expect(page).toHaveURL(/\/$/);
  });

  test("shows the connection error screen when the API is unreachable on the contacts page", async ({ page }) => {
    await registerUser(page);
    await page.route(`${API}/**`, (route) => route.abort());

    await page.reload();

    await expect(page.locator("disconnected")).toContainText("Connection error");
  });

  test("the next user to log in never sees the previous user's contacts", async ({ page }) => {
    const second = await registerUser(page);
    await logout(page);
    await registerUser(page);
    await addContact(page, { ...sample, name: "Previous user contact" });
    await logout(page);

    // A slow server keeps the contacts page loading long enough to notice stale data.
    await page.route(`${API}/get-user`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });
    await page.locator("login-button").click();
    await page.locator("username-input input").fill(second.username);
    await page.locator("password-input input").fill(second.password);
    await page.locator("login-modal login-button").click();

    await expect(page.locator("loader")).toBeVisible();
    await expect(page.getByText("Previous user contact")).toHaveCount(0);
    await expect(page.locator("username")).toHaveText(new RegExp(second.username));
    await expect(page.getByText("Previous user contact")).toHaveCount(0);
  });

  test("stale credentials (e.g. a deleted account) are cleared and the user is redirected", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.username = "e2e_does_not_exist";
      localStorage.password = "password123";
    });

    await page.goto("/user");

    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => localStorage.username)).toBeUndefined();
  });
});
