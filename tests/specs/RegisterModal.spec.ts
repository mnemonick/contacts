import { expect, test } from "@playwright/test";
import { API, login, logout, register, registerUser, username } from "$/utils.ts";

test.describe("RegisterModal", () => {
  test("registers and lands on an empty contacts page that survives a reload", async ({ page }) => {
    const credentials = await registerUser(page);

    await expect(page.getByText("No contacts")).toBeVisible();
    await expect(page.locator("username")).toHaveText(new RegExp(credentials.username));

    await page.reload();
    await expect(page.locator("username")).toHaveText(new RegExp(credentials.username));
  });

  test("submits on Enter", async ({ page }) => {
    await page.goto("/");
    await page.locator("register-button").click();
    await page.locator("username-input input").fill(username());
    await page.locator("password-input input").fill("password123");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/user$/);
  });

  test("username of 3 characters is rejected, 4 characters is accepted", async ({ page }) => {
    // Random suffix so repeated runs against the same database don't collide.
    const name = Math.random().toString(36).slice(2, 6);

    await register(page, { username: name.slice(0, 3), password: "password123" });
    await expect(page.locator("error")).toHaveText("Username must be at least 4 characters long");

    await page.locator("username-input input").fill(name);
    await expect(page.locator("error")).toBeHidden();
    await page.locator("register-modal register-button").click();
    await expect(page).toHaveURL(/\/user$/);
  });

  test("password of 5 characters is rejected, 6 characters is accepted", async ({ page }) => {
    await register(page, { username: username(), password: "12345" });
    await expect(page.locator("error")).toHaveText("Password must be at least 6 characters long");
    await expect(page).toHaveURL(/\/$/);

    await page.locator("password-input input").fill("123456");
    await page.locator("register-modal register-button").click();
    await expect(page).toHaveURL(/\/user$/);
  });

  test("validation error appears after the user stops typing, without submitting", async ({ page }) => {
    await page.goto("/");
    await page.locator("register-button").click();
    await page.locator("username-input input").fill("ab");

    // DIRTY_DELAY in Input.tsx is 4 seconds.
    await expect(page.locator("error")).toBeVisible({ timeout: 8000 });
  });

  test("taken username shows an error modal; closing it keeps the form", async ({ page }) => {
    const credentials = await registerUser(page);
    await logout(page);

    await register(page, { username: credentials.username, password: "another-password" });

    await expect(page.locator("error-modal message")).toHaveText("Username is already taken");
    await page.keyboard.press("Escape");
    await expect(page.locator("error-modal")).toBeHidden();
    await expect(page.locator("register-modal")).toBeVisible();
    await expect(page.locator("username-input input")).toHaveValue(credentials.username);

    // The failed attempt must not overwrite the original account.
    await page.keyboard.press("Escape");
    await login(page, credentials);
    await expect(page).toHaveURL(/\/user$/);
  });

  test("SQL-like username is stored as plain text and does not bypass the password", async ({ page }) => {
    const credentials = { username: `${username()}' OR '1'='1`, password: "password123" };

    await register(page, credentials);
    await expect(page.locator("username")).toContainText(credentials.username);
    await logout(page);

    await login(page, { username: credentials.username, password: "' OR '1'='1" });
    await expect(page.locator("error-modal message")).toHaveText("User not found");
  });

  test("shows the connection error screen when the API is unreachable", async ({ page }) => {
    await page.route(`${API}/**`, (route) => route.abort());

    await register(page, { username: username(), password: "password123" });

    await expect(page.locator("disconnected")).toContainText("Connection error");
  });
});
