import {
  buildLabel,
  buildStatus,
  buildTask,
  buildUser,
  credentials,
  seedStatuses,
} from "./data.js";
import { expect, test } from "./fixtures.js";

const [draftStatus] = seedStatuses;

test.describe("Kanban board", () => {
  let assignee;
  let status;
  let label;

  // Для каждой задачи тест заводит своего исполнителя, статус и метку, поэтому
  // в колонке статуса и в выдаче фильтров оказываются только его задачи.
  test.beforeEach(async ({ loginPage, usersPage, statusesPage, labelsPage }) => {
    assignee = buildUser();
    status = buildStatus();
    label = buildLabel();
    await loginPage.signIn(credentials);
    await usersPage.create(assignee);
    await statusesPage.create(status);
    await labelsPage.create(label);
  });

  const buildOwnTask = () =>
    buildTask({ assignee: assignee.email, status: status.name, labels: [label.name] });

  test("shows a column for every status", async ({ tasksPage }) => {
    await tasksPage.open();

    await expect(tasksPage.columnTitles).toContainText([
      ...seedStatuses.map(({ name }) => name),
      status.name,
    ]);
    await expect(tasksPage.column(draftStatus.name).getByRole("button")).not.toHaveCount(0);
    await expect(tasksPage.column(status.name).getByRole("button")).toHaveCount(0);
  });

  test("shows an empty task form", async ({ tasksPage }) => {
    await tasksPage.startCreate();

    await expect(tasksPage.titleInput).toHaveValue("");
    await expect(tasksPage.contentInput).toHaveValue("");
    await expect(tasksPage.saveButton).toBeDisabled();
  });

  test("creates a task in the status column", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.open();

    await expect(tasksPage.cardInColumn(task.title, task.status)).toBeVisible();
    await expect(tasksPage.cardInColumn(task.title, task.status)).toContainText(task.content);
  });

  test("shows task details", async ({ page, tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.openDetails(task.title);

    const details = page.getByRole("main");
    await expect(details.getByRole("link", { name: task.assignee })).toBeVisible();
    await expect(details.getByText(task.title, { exact: true })).toBeVisible();
    await expect(details.getByText(task.content, { exact: true })).toBeVisible();
    await expect(details.getByRole("link", { name: label.name })).toBeVisible();
  });

  test("edits a task", async ({ tasksPage }) => {
    const task = buildOwnTask();
    const changes = buildTask({ status: draftStatus.name });

    await tasksPage.create(task);
    await tasksPage.update(task.title, {
      title: changes.title,
      content: changes.content,
      status: changes.status,
    });
    await tasksPage.open();

    await expect(tasksPage.cardInColumn(changes.title, draftStatus.name)).toContainText(
      changes.content,
    );
    await expect(tasksPage.card(task.title)).toHaveCount(0);
    await expect(tasksPage.column(status.name).getByRole("button")).toHaveCount(0);
  });

  test("deletes a task", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.delete(task.title);
    await tasksPage.open();

    await expect(tasksPage.card(task.title)).toHaveCount(0);
  });

  test("restores a task when deletion is undone", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.delete(task.title);
    await tasksPage.undo();

    await expect(tasksPage.cardInColumn(task.title, status.name)).toBeVisible();
  });

  test("filters tasks by assignee", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.filterBy("Assignee", assignee.email);

    await expect(tasksPage.cards).toHaveCount(1);
    await expect(tasksPage.card(task.title)).toBeVisible();
  });

  test("filters tasks by status", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.filterBy("Status", status.name);

    await expect(tasksPage.cards).toHaveCount(1);
    await expect(tasksPage.cardInColumn(task.title, status.name)).toBeVisible();
  });

  test("filters tasks by label", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.filterBy("Label", label.name);

    await expect(tasksPage.cards).toHaveCount(1);
    await expect(tasksPage.card(task.title)).toBeVisible();
  });

  test("moves a task to another column", async ({ tasksPage }) => {
    const task = buildOwnTask();

    await tasksPage.create(task);
    await tasksPage.open();
    await tasksPage.moveTask(task.title, draftStatus.name);

    await expect(tasksPage.cardInColumn(task.title, draftStatus.name)).toBeVisible();
    await expect(tasksPage.column(status.name).getByRole("button")).toHaveCount(0);

    await tasksPage.openSection("Dashboard");
    await tasksPage.open();
    await expect(tasksPage.cardInColumn(task.title, draftStatus.name)).toBeVisible();
  });
});
