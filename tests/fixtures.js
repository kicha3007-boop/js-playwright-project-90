import { test as base } from "@playwright/test";
import LabelsPage from "./pages/LabelsPage.js";
import LoginPage from "./pages/LoginPage.js";
import StatusesPage from "./pages/StatusesPage.js";
import TasksPage from "./pages/TasksPage.js";
import UsersPage from "./pages/UsersPage.js";

// Каждый тест получает свои экземпляры страниц поверх собственной вкладки,
// поэтому состояние приложения у тестов не пересекается.
export const test = base.extend({
  loginPage: async ({ page }, provide) => {
    await provide(new LoginPage(page));
  },
  usersPage: async ({ page }, provide) => {
    await provide(new UsersPage(page));
  },
  statusesPage: async ({ page }, provide) => {
    await provide(new StatusesPage(page));
  },
  labelsPage: async ({ page }, provide) => {
    await provide(new LabelsPage(page));
  },
  tasksPage: async ({ page }, provide) => {
    await provide(new TasksPage(page));
  },
});

export { expect } from "@playwright/test";
