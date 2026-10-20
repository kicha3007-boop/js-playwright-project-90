import { buildStatus, credentials, messages, seedStatuses } from "./data.js";
import { expect, test } from "./fixtures.js";

const [firstSeedStatus, secondSeedStatus] = seedStatuses;

test.describe("Task statuses", () => {
  let existingStatus;

  test.beforeEach(async ({ loginPage, statusesPage }) => {
    existingStatus = buildStatus();
    await loginPage.signIn(credentials);
    await statusesPage.create(existingStatus);
  });

  test("shows an empty creation form", async ({ statusesPage }) => {
    await statusesPage.startCreate();

    await expect(statusesPage.input("name")).toHaveValue("");
    await expect(statusesPage.input("slug")).toHaveValue("");
    await expect(statusesPage.saveButton).toBeDisabled();
  });

  test("creates a status", async ({ statusesPage }) => {
    const status = buildStatus();

    await statusesPage.create(status);
    await statusesPage.open();

    await expect(statusesPage.row(status.name).getByRole("cell")).toContainText([
      status.name,
      status.slug,
    ]);
  });

  test("does not create a status without a slug", async ({ statusesPage }) => {
    const status = { name: buildStatus().name };

    await statusesPage.create(status);

    await expect(statusesPage.fieldError(messages.required)).toBeVisible();
    await statusesPage.open();
    await expect(statusesPage.row(status.name)).toHaveCount(0);
  });

  test("lists statuses with name and slug", async ({ statusesPage }) => {
    await statusesPage.open();

    await expect(statusesPage.columnHeaders).toContainText(["Name", "Slug"]);
    for (const status of [...seedStatuses, existingStatus]) {
      await expect(statusesPage.row(status.name).getByRole("cell")).toContainText([
        status.name,
        status.slug,
      ]);
    }
  });

  test("shows the edit form with status data", async ({ statusesPage }) => {
    await statusesPage.openRecord(existingStatus.name);

    await expect(statusesPage.input("name")).toHaveValue(existingStatus.name);
    await expect(statusesPage.input("slug")).toHaveValue(existingStatus.slug);
  });

  test("edits a status", async ({ statusesPage }) => {
    const changes = buildStatus();

    await statusesPage.update(existingStatus.name, changes);
    await statusesPage.open();

    await expect(statusesPage.row(changes.name).getByRole("cell")).toContainText([
      changes.name,
      changes.slug,
    ]);
    await expect(statusesPage.row(existingStatus.name)).toHaveCount(0);
  });

  test("does not save an empty name on edit", async ({ statusesPage }) => {
    await statusesPage.update(existingStatus.name, { name: "" });

    await expect(statusesPage.fieldError(messages.required)).toBeVisible();
    await statusesPage.open();
    await expect(statusesPage.row(existingStatus.name)).toHaveCount(1);
  });

  test("deletes a status", async ({ statusesPage }) => {
    await statusesPage.delete(existingStatus.name);

    await expect(statusesPage.row(existingStatus.name)).toHaveCount(0);
    await expect(statusesPage.row(firstSeedStatus.name)).toHaveCount(1);
  });

  test("restores a status when deletion is undone", async ({ statusesPage }) => {
    await statusesPage.delete(existingStatus.name);
    await statusesPage.undo();

    await expect(statusesPage.row(existingStatus.name)).toHaveCount(1);
  });

  test("deletes selected statuses", async ({ statusesPage }) => {
    await statusesPage.open();
    await statusesPage.selectRows([existingStatus.name, firstSeedStatus.name]);

    await expect(statusesPage.selectedCounter).toHaveText("2 items selected");
    await statusesPage.deleteSelected();

    await expect(statusesPage.row(existingStatus.name)).toHaveCount(0);
    await expect(statusesPage.row(firstSeedStatus.name)).toHaveCount(0);
    await expect(statusesPage.row(secondSeedStatus.name)).toHaveCount(1);
  });

  test("deletes all statuses", async ({ statusesPage }) => {
    await statusesPage.open();
    await statusesPage.selectAll();

    const rowsCount = await statusesPage.rows.count();
    await expect(statusesPage.selectedCounter).toHaveText(`${rowsCount} items selected`);
    for (const checkbox of await statusesPage.rows.getByRole("checkbox").all()) {
      await expect(checkbox).toBeChecked();
    }

    await statusesPage.deleteSelected();

    await expect(statusesPage.emptyListMessage).toBeVisible();
    await expect(statusesPage.rows).toHaveCount(0);
  });
});
