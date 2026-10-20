# Тестирование Канбан-доски (JS)

[![hexlet-check](https://github.com/kicha3007-boop/js-playwright-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kicha3007-boop/js-playwright-project-90/actions/workflows/hexlet-check.yml)
[![CI](https://github.com/kicha3007-boop/js-playwright-project-90/actions/workflows/main.yml/badge.svg)](https://github.com/kicha3007-boop/js-playwright-project-90/actions/workflows/main.yml)

Учебный проект Хекслета: https://ru.hexlet.io/programs/js-playwright

Сквозные тесты [Playwright](https://playwright.dev/) для менеджера задач
[@hexlet/testing-task-manager](https://www.npmjs.com/package/@hexlet/testing-task-manager) — приложения на
react-admin с канбан-доской. Тесты проверяют запуск приложения, вход и выход, работу с пользователями,
статусами, метками и задачами (создание, просмотр списка, правка, удаление по одной записи и массово),
фильтрацию задач и перенос карточек между колонками доски.

## Стек

- JavaScript, Vite + React (обёртка, которая запускает тестируемое приложение)
- Playwright Test
- oxlint и oxfmt

## Установка

Нужны Node.js 22+ и GNU Make.

```bash
git clone https://github.com/kicha3007-boop/js-playwright-project-90.git
cd js-playwright-project-90
make install            # зависимости
make install-browsers   # Chromium для Playwright
```

## Использование

```bash
make dev    # приложение на http://localhost:5173
make test   # тесты; dev-сервер поднимается сам
make lint   # линтер и проверка форматирования
make lint-fix
```

Чтобы прогнать тесты против уже запущенного приложения по другому адресу, задайте его в `APP_BASE_URL` —
тесты ходят только по относительным путям:

```bash
APP_BASE_URL=http://localhost:4173 make test
```

## Устройство тестов

```
tests/
  fixtures.js        # фикстуры Playwright: экземпляры Page Object для каждого теста
  data.js            # тестовые данные и генераторы уникальных записей
  pages/
    BasePage.js      # меню, уведомления, выпадающие списки
    LoginPage.js     # вход и выход
    ResourcePage.js  # общий раздел со списком и формами
    UsersPage.js, StatusesPage.js, LabelsPage.js
    TasksPage.js     # канбан-доска: карточки, колонки, фильтры, перетаскивание
  app.spec.js, auth.spec.js, users.spec.js, statuses.spec.js, labels.spec.js, tasks.spec.js
```

- Локаторы и действия с интерфейсом собраны в классах Page Object, тесты содержат только шаги сценария и
  проверки результата через `expect()`.
- Вход выполняет один класс `LoginPage` в хуке `beforeEach`; каждый тест работает в своей вкладке со своим
  состоянием приложения и создаёт свои записи с уникальными именами.
- Настройки браузера и адрес приложения заданы в `playwright.config.ts`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
