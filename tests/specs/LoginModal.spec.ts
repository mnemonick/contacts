import { expect, test } from "@playwright/test";
import { addContact, login, logout, registerUser, sample, username } from "$/utils.ts";

test.describe("LoginModal", () => {
  test("logs in with the user's contacts and stays logged in after a reload", async ({ page }) => {
    const credentials = await registerUser(page);
    await addContact(page, sample);
    await logout(page);

    await login(page, credentials);

    await expect(page.locator("username")).toHaveText(new RegExp(credentials.username));
    await expect(page.locator("contact name")).toHaveText(sample.name);
    await page.reload();
    await expect(page.locator("contact name")).toHaveText(sample.name);
  });

  test("wrong password shows 'User not found' and stays on the guest page", async ({ page }) => {
    const credentials = await registerUser(page);
    await logout(page);

    await login(page, { ...credentials, password: "wrong-password" });

    await expect(page.locator("error-modal heading")).toHaveText("Error");
    await expect(page.locator("error-modal message")).toHaveText("User not found");
    await expect(page).toHaveURL(/\/$/);
  });

  test("short password shows an error and stays on the guest page", async ({ page }) => {
    await login(page, { username: username(), password: "12345" });

    await expect(page.locator("error")).toHaveText("Password should be at least 6 characters long");
    await expect(page).toHaveURL(/\/$/);
  });
});
