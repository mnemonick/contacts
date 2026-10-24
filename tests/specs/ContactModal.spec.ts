import { expect, test } from "@playwright/test";
import { API, addContact, fill, registerUser, sample } from "$/utils.ts";

test.describe("ContactModal: create", () => {
  test("creates a contact that survives a reload", async ({ page }) => {
    await registerUser(page);

    await addContact(page, sample);

    const row = page.locator("contact");
    await expect(row).toHaveCount(1);
    await expect(row.locator("name")).toHaveText(sample.name);
    await expect(row.locator("email")).toHaveText(sample.email);
    await expect(row.locator("comment")).toHaveText(sample.comment);

    await page.reload();
    await expect(page.locator("contact name")).toHaveText(sample.name);
  });

  test("a new contact appears at the top of the list and stays there after a reload", async ({ page }) => {
    await registerUser(page);

    await addContact(page, { ...sample, name: "Alice" });
    await addContact(page, { ...sample, name: "Bob" });

    await expect(page.locator("contact name")).toHaveText(["Bob", "Alice"]);
    await page.reload();
    await expect(page.locator("contact name")).toHaveText(["Bob", "Alice"]);
  });

  test("name of exactly 3 characters is accepted", async ({ page }) => {
    await registerUser(page);

    await addContact(page, { ...sample, name: "Bob" });

    await expect(page.locator("contact name")).toHaveText("Bob");
  });

  test("name of 2 characters shows an error and nothing is saved", async ({ page }) => {
    await registerUser(page);

    await page.locator("create-button").click();
    await fill(page, { ...sample, name: "ab" });
    await page.locator("contact-modal create-button").click();

    await expect(page.locator("error")).toHaveText("Name must be at least 3 characters long");
    await page.reload();
    await expect(page.getByText("No contacts")).toBeVisible();
  });

  test("Enter on the focused create button creates exactly one contact", async ({ page }) => {
    await registerUser(page);

    await page.locator("create-button").click();
    await fill(page, sample);
    await page.locator("contact-modal create-button").focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("contact-modal")).toBeHidden();
    await page.reload();
    await expect(page.locator("contact")).toHaveCount(1);
  });

  test("double click on the create button creates exactly one contact", async ({ page }) => {
    await registerUser(page);

    await page.locator("create-button").click();
    await fill(page, sample);
    await page.locator("contact-modal create-button").dblclick();

    await expect(page.locator("contact-modal")).toBeHidden();
    await page.reload();
    await expect(page.locator("contact")).toHaveCount(1);
  });

  test("a server error shows an error message and keeps the form", async ({ page }) => {
    await registerUser(page);
    await page.route(`${API}/create-contact`, (route) => route.fulfill({ json: { error: "INTERNAL" } }));

    await page.locator("create-button").click();
    await fill(page, sample);
    await page.locator("contact-modal create-button").click();

    await expect(page.locator("error-modal message")).toHaveText("Something went wrong, try again");
    await page.keyboard.press("Escape");
    await expect(page.locator("error-modal")).toBeHidden();
    await expect(page.locator("name-input input")).toHaveValue(sample.name);
  });

  test("invalid emails show an error and nothing is saved", async ({ page }) => {
    await registerUser(page);
    await page.locator("create-button").click();
    await fill(page, { ...sample, email: "john" });
    await page.locator("contact-modal create-button").click();

    // After a submit the error follows the input, so each value is checked without submitting again.
    for (const email of ["john", "john@example", "@example.com", "john smith@example.com"]) {
      await page.locator("email-input input").fill(email);
      await expect(page.locator("error")).toHaveText("Incorrect email");
    }

    await page.reload();
    await expect(page.getByText("No contacts")).toBeVisible();
  });
});

test.describe("ContactModal: edit", () => {
  test("edit form is prefilled and saves all fields", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);
    const changes = { name: "Jane Doe", email: "jane@example.com", comment: "new comment" };

    await page.locator("contact").click();
    await expect(page.locator("contact-modal heading")).toHaveText("Edit Contact");
    await expect(page.locator("name-input input")).toHaveValue(sample.name);
    await expect(page.locator("email-input input")).toHaveValue(sample.email);
    await expect(page.locator("comment-input input")).toHaveValue(sample.comment);

    await fill(page, changes);
    await page.locator("update-button").click();
    await expect(page.locator("contact-modal")).toBeHidden();

    const row = page.locator("contact");
    await expect(row.locator("name")).toHaveText(changes.name);
    await page.reload();
    await expect(row.locator("name")).toHaveText(changes.name);
    await expect(row.locator("email")).toHaveText(changes.email);
    await expect(row.locator("comment")).toHaveText(changes.comment);
  });

  test("clearing the comment on edit shows '-', also after reload", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);

    await page.locator("contact").click();
    await fill(page, { comment: "" });
    await page.locator("update-button").click();

    await expect(page.locator("contact comment")).toHaveText("-");
    await page.reload();
    await expect(page.locator("contact comment")).toHaveText("-");
  });

  test("Enter saves the edit of the selected contact only", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);
    await addContact(page, { ...sample, name: "Second" });

    await page.locator("contact", { hasText: "Second" }).click();
    await fill(page, { name: "Second edited" });
    await page.keyboard.press("Enter");
    await expect(page.locator("contact-modal")).toBeHidden();

    await page.reload();
    // Contacts are listed newest first (ORDER BY id DESC), so the edited "Second" stays on top.
    await expect(page.locator("contact name")).toHaveText(["Second edited", sample.name]);
  });

  test("closing the edit modal without saving keeps the original data", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);

    await page.locator("contact").click();
    await fill(page, { name: "Not saved" });
    await page.keyboard.press("Escape");
    await expect(page.locator("contact-modal")).toBeHidden();

    await expect(page.locator("contact name")).toHaveText(sample.name);
    await page.locator("contact").click();
    await expect(page.locator("name-input input")).toHaveValue(sample.name);
  });

  test("invalid edit shows an error and keeps the original data", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);

    await page.locator("contact").click();
    await fill(page, { name: "ab" });
    await page.locator("update-button").click();

    await expect(page.locator("error")).toHaveText("Name must be at least 3 characters long");
    await page.reload();
    await expect(page.locator("contact name")).toHaveText(sample.name);
  });
});

test.describe("ContactModal: delete", () => {
  test("deleting the last contact shows the empty placeholder, also after reload", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);

    await page.locator("contact").click();
    await page.locator("delete-button").click();

    await expect(page.locator("contact-modal")).toBeHidden();
    await expect(page.getByText("No contacts")).toBeVisible();
    await page.reload();
    await expect(page.getByText("No contacts")).toBeVisible();
  });

  test("deleting one contact keeps the others", async ({ page }) => {
    await registerUser(page);
    await addContact(page, sample);
    await addContact(page, { ...sample, name: "Keep Me" });

    await page.locator("contact", { hasText: sample.name }).click();
    await page.locator("delete-button").click();

    await expect(page.locator("contact")).toHaveCount(1);
    await page.reload();
    await expect(page.locator("contact name")).toHaveText("Keep Me");
  });
});
