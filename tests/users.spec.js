import { buildUser, credentials, invalidEmail, messages, seedUsers } from "./data.js";
import { expect, test } from "./fixtures.js";

const [firstSeedUser, secondSeedUser] = seedUsers;

test.describe("Users", () => {
  let existingUser;

  test.beforeEach(async ({ loginPage, usersPage }) => {
    existingUser = buildUser();
    await loginPage.signIn(credentials);
    await usersPage.create(existingUser);
  });

  test("shows an empty creation form", async ({ usersPage }) => {
    await usersPage.startCreate();

    await expect(usersPage.input("email")).toHaveValue("");
    await expect(usersPage.input("firstName")).toHaveValue("");
    await expect(usersPage.input("lastName")).toHaveValue("");
    await expect(usersPage.saveButton).toBeDisabled();
  });

  test("creates a user", async ({ usersPage }) => {
    const user = buildUser();

    await usersPage.create(user);
    await usersPage.open();

    await expect(usersPage.row(user.email).getByRole("cell")).toContainText([
      user.email,
      user.firstName,
      user.lastName,
    ]);
  });

  test("does not create a user with an invalid email", async ({ usersPage }) => {
    const user = { ...buildUser(), email: invalidEmail };

    await usersPage.create(user);

    await expect(usersPage.fieldError(messages.invalidEmail)).toBeVisible();
    await usersPage.open();
    await expect(usersPage.row(user.firstName)).toHaveCount(0);
  });

  test("lists users with email, first name and last name", async ({ usersPage }) => {
    await usersPage.open();

    await expect(usersPage.columnHeaders).toContainText(["Email", "First name", "Last name"]);
    for (const user of [firstSeedUser, existingUser]) {
      await expect(usersPage.row(user.email).getByRole("cell")).toContainText([
        user.email,
        user.firstName,
        user.lastName,
      ]);
    }
  });

  test("shows the edit form with user data", async ({ usersPage }) => {
    await usersPage.openRecord(existingUser.email);

    await expect(usersPage.input("email")).toHaveValue(existingUser.email);
    await expect(usersPage.input("firstName")).toHaveValue(existingUser.firstName);
    await expect(usersPage.input("lastName")).toHaveValue(existingUser.lastName);
  });

  test("edits a user", async ({ usersPage }) => {
    const changes = buildUser();

    await usersPage.update(existingUser.email, changes);
    await usersPage.open();

    await expect(usersPage.row(changes.email).getByRole("cell")).toContainText([
      changes.email,
      changes.firstName,
      changes.lastName,
    ]);
    await expect(usersPage.row(existingUser.email)).toHaveCount(0);
  });

  test("does not save an invalid email on edit", async ({ usersPage }) => {
    await usersPage.update(existingUser.email, { email: invalidEmail });

    await expect(usersPage.fieldError(messages.invalidEmail)).toBeVisible();
    await usersPage.open();
    await expect(usersPage.row(existingUser.email)).toHaveCount(1);
    await expect(usersPage.row(invalidEmail)).toHaveCount(0);
  });

  test("does not save an empty first name on edit", async ({ usersPage }) => {
    await usersPage.update(existingUser.email, { firstName: "" });

    await expect(usersPage.fieldError(messages.required)).toBeVisible();
    await usersPage.open();
    await expect(usersPage.row(existingUser.email).getByRole("cell")).toContainText([
      existingUser.firstName,
    ]);
  });

  test("deletes a user", async ({ usersPage }) => {
    await usersPage.delete(existingUser.email);

    await expect(usersPage.row(existingUser.email)).toHaveCount(0);
    await expect(usersPage.row(firstSeedUser.email)).toHaveCount(1);
  });

  test("restores a user when deletion is undone", async ({ usersPage }) => {
    await usersPage.delete(existingUser.email);
    await usersPage.undo();

    await expect(usersPage.row(existingUser.email)).toHaveCount(1);
  });

  test("deletes selected users", async ({ usersPage }) => {
    await usersPage.open();
    await usersPage.selectRows([existingUser.email, firstSeedUser.email]);

    await expect(usersPage.selectedCounter).toHaveText("2 items selected");
    await usersPage.deleteSelected();

    await expect(usersPage.row(existingUser.email)).toHaveCount(0);
    await expect(usersPage.row(firstSeedUser.email)).toHaveCount(0);
    await expect(usersPage.row(secondSeedUser.email)).toHaveCount(1);
  });

  test("deletes all users", async ({ usersPage }) => {
    await usersPage.open();
    await usersPage.selectAll();

    const rowsCount = await usersPage.rows.count();
    await expect(usersPage.selectedCounter).toHaveText(`${rowsCount} items selected`);
    for (const checkbox of await usersPage.rows.getByRole("checkbox").all()) {
      await expect(checkbox).toBeChecked();
    }

    await usersPage.deleteSelected();

    await expect(usersPage.emptyListMessage).toBeVisible();
    await expect(usersPage.rows).toHaveCount(0);
  });
});
