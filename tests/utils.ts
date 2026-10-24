import { expect, type Page } from "@playwright/test";

export const API = "http://localhost:5001";

export type Credentials = { username: string; password: string };
export type ContactData = { name: string; email: string; comment: string };

export const sample: ContactData = {
  name: "John Smith",
  email: "john@example.com",
  comment: "met at the conference"
};

// Every test works with its own user, so tests are independent and can run in parallel on a shared database.
export function username() {
  return `e2e_${crypto.randomUUID().slice(0, 12)}`;
}

export async function register(page: Page, credentials: Credentials) {
  await page.goto("/");
  await page.locator("register-button").click();
  await page.locator("username-input input").fill(credentials.username);
  await page.locator("password-input input").fill(credentials.password);
  await page.locator("register-modal register-button").click();
}

export async function registerUser(page: Page): Promise<Credentials> {
  const credentials = { username: username(), password: "password123" };

  await register(page, credentials);
  await expect(page).toHaveURL(/\/user$/);

  return credentials;
}

export async function login(page: Page, credentials: Credentials) {
  await page.goto("/");
  await page.locator("login-button").click();
  await page.locator("username-input input").fill(credentials.username);
  await page.locator("password-input input").fill(credentials.password);
  await page.locator("login-modal login-button").click();
}

export async function logout(page: Page) {
  await page.locator("exit").click();
  await expect(page).toHaveURL(/\/$/);
}

export async function fill(page: Page, contact: Partial<ContactData>) {
  if (contact.name !== undefined) await page.locator("name-input input").fill(contact.name);
  if (contact.email !== undefined) await page.locator("email-input input").fill(contact.email);
  if (contact.comment !== undefined) await page.locator("comment-input input").fill(contact.comment);
}

export async function addContact(page: Page, contact: ContactData) {
  await page.locator("create-button").click();
  await fill(page, contact);
  await page.locator("contact-modal create-button").click();
  await expect(page.locator("contact-modal")).toBeHidden();
}
