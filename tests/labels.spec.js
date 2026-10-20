import { buildLabel, credentials, messages, seedLabels } from "./data.js";
import { expect, test } from "./fixtures.js";

const [firstSeedLabel, secondSeedLabel] = seedLabels;

test.describe("Labels", () => {
  let existingLabel;

  test.beforeEach(async ({ loginPage, labelsPage }) => {
    existingLabel = buildLabel();
    await loginPage.signIn(credentials);
    await labelsPage.create(existingLabel);
  });

  test("shows an empty creation form", async ({ labelsPage }) => {
    await labelsPage.startCreate();

    await expect(labelsPage.input("name")).toHaveValue("");
    await expect(labelsPage.saveButton).toBeDisabled();
  });

  test("creates a label", async ({ labelsPage }) => {
    const label = buildLabel();

    await labelsPage.create(label);
    await labelsPage.open();

    await expect(labelsPage.row(label.name).getByRole("cell")).toContainText([label.name]);
  });

  test("lists labels with names", async ({ labelsPage }) => {
    await labelsPage.open();

    await expect(labelsPage.columnHeaders).toContainText(["Name"]);
    for (const label of [...seedLabels, existingLabel]) {
      await expect(labelsPage.row(label.name)).toHaveCount(1);
    }
  });

  test("shows the edit form with label data", async ({ labelsPage }) => {
    await labelsPage.openRecord(existingLabel.name);

    await expect(labelsPage.input("name")).toHaveValue(existingLabel.name);
  });

  test("edits a label", async ({ labelsPage }) => {
    const changes = buildLabel();

    await labelsPage.update(existingLabel.name, changes);
    await labelsPage.open();

    await expect(labelsPage.row(changes.name)).toHaveCount(1);
    await expect(labelsPage.row(existingLabel.name)).toHaveCount(0);
  });

  test("does not save an empty name on edit", async ({ labelsPage }) => {
    await labelsPage.update(existingLabel.name, { name: "" });

    await expect(labelsPage.fieldError(messages.required)).toBeVisible();
    await labelsPage.open();
    await expect(labelsPage.row(existingLabel.name)).toHaveCount(1);
  });

  test("deletes a label", async ({ labelsPage }) => {
    await labelsPage.delete(existingLabel.name);

    await expect(labelsPage.row(existingLabel.name)).toHaveCount(0);
    await expect(labelsPage.row(firstSeedLabel.name)).toHaveCount(1);
  });

  test("restores a label when deletion is undone", async ({ labelsPage }) => {
    await labelsPage.delete(existingLabel.name);
    await labelsPage.undo();

    await expect(labelsPage.row(existingLabel.name)).toHaveCount(1);
  });

  test("deletes selected labels", async ({ labelsPage }) => {
    await labelsPage.open();
    await labelsPage.selectRows([existingLabel.name, firstSeedLabel.name]);

    await expect(labelsPage.selectedCounter).toHaveText("2 items selected");
    await labelsPage.deleteSelected();

    await expect(labelsPage.row(existingLabel.name)).toHaveCount(0);
    await expect(labelsPage.row(firstSeedLabel.name)).toHaveCount(0);
    await expect(labelsPage.row(secondSeedLabel.name)).toHaveCount(1);
  });

  test("deletes all labels", async ({ labelsPage }) => {
    await labelsPage.open();
    await labelsPage.selectAll();

    const rowsCount = await labelsPage.rows.count();
    await expect(labelsPage.selectedCounter).toHaveText(`${rowsCount} items selected`);
    for (const checkbox of await labelsPage.rows.getByRole("checkbox").all()) {
      await expect(checkbox).toBeChecked();
    }

    await labelsPage.deleteSelected();

    await expect(labelsPage.emptyListMessage).toBeVisible();
    await expect(labelsPage.rows).toHaveCount(0);
  });
});
