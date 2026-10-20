import { defineConfig, devices } from "@playwright/test";

// Адрес приложения задаётся снаружи (APP_BASE_URL), тесты ходят по относительным
// путям. Без переменной тесты запускают локальный dev-сервер Vite.
const appBaseUrl = process.env.APP_BASE_URL;
const localUrl = "http://localhost:5173";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tmp/artifacts",
  forbidOnly: isCI,
  retries: 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["list"], ["html", { open: "never", outputFolder: "tmp/report" }]] : "list",
  use: {
    baseURL: appBaseUrl ?? localUrl,
    locale: "ru-RU",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: appBaseUrl
    ? undefined
    : {
        command: "npm run dev -- --port 5173 --strictPort",
        url: localUrl,
        reuseExistingServer: !isCI,
      },
});
