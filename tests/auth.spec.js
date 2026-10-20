import { credentials, messages } from "./data.js";
import { expect, test } from "./fixtures.js";

test.describe("Authentication", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("signs in with a login and a password", async ({ page, loginPage }) => {
    await loginPage.login(credentials);

    await expect(page).not.toHaveURL(/login/);
    await expect(loginPage.dashboardContent).toBeVisible();
    await expect(loginPage.menuItem("Users")).toBeVisible();
    await expect(loginPage.profileButton).toBeVisible();
  });

  test("does not sign in with empty credentials", async ({ page, loginPage }) => {
    await loginPage.signInButton.click();

    await expect(page.getByText(messages.required, { exact: true })).toHaveCount(2);
    await expect(page).toHaveURL(/#\/login$/);
    await expect(loginPage.dashboardContent).toBeHidden();
  });

  test("does not sign in without a password", async ({ page, loginPage }) => {
    await loginPage.login({ username: credentials.username, password: "" });

    await expect(page.getByText(messages.required, { exact: true })).toHaveCount(1);
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.dashboardContent).toBeHidden();
  });

  test("signs out to the login form", async ({ page, loginPage }) => {
    await loginPage.login(credentials);
    await loginPage.dashboardContent.waitFor();

    await loginPage.logout();

    await expect(page).toHaveURL(/#\/login$/);
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.profileButton).toBeHidden();
  });

  test("closes the sections after signing out", async ({ page, loginPage }) => {
    await loginPage.login(credentials);
    await loginPage.dashboardContent.waitFor();
    await loginPage.logout();

    await page.goto("/#/tasks");

    await expect(page).toHaveURL(/#\/login$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
