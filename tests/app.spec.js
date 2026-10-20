import { expect, test } from "./fixtures.js";

test.describe("Application start", () => {
  test("renders the login form for a guest", async ({ page, loginPage }) => {
    await page.goto("/");

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeEnabled();
  });

  test("redirects a guest from a closed section to the login form", async ({ page, loginPage }) => {
    await page.goto("/#/users");

    await expect(page).toHaveURL(/#\/login$/);
    await expect(loginPage.signInButton).toBeVisible();
  });
});
