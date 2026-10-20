import BasePage from "./BasePage.js";

// Канбан-доска: колонка на каждый статус, задачи — перетаскиваемые карточки.
export default class TasksPage extends BasePage {
  constructor(page) {
    super(page);
    this.board = page.getByRole("main");
    this.columnTitles = this.board.getByRole("heading", { level: 6 });
    this.cards = this.board
      .getByRole("button")
      .filter({ has: page.getByRole("link", { name: "Show" }) });
    this.createLink = page.getByRole("link", { name: "Create" });
    this.titleInput = page.getByRole("textbox", { name: "Title", exact: true });
    this.contentInput = page.getByRole("textbox", { name: "Content", exact: true });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
  }

  async open() {
    await this.openSection("Tasks");
  }

  column(statusName) {
    return this.board
      .getByRole("heading", { name: statusName, exact: true, level: 6 })
      .locator("..");
  }

  card(title) {
    return this.cards.filter({ has: this.page.getByText(title, { exact: true }) });
  }

  cardInColumn(title, statusName) {
    return this.column(statusName)
      .getByRole("button")
      .filter({ has: this.page.getByText(title, { exact: true }) });
  }

  async chooseLabels(labels) {
    if (labels.length === 0) {
      return;
    }
    await this.combobox("Label").click();
    for (const label of labels) {
      await this.page.getByRole("option", { name: label, exact: true }).click();
    }
    await this.page.keyboard.press("Escape");
  }

  async fillForm({ assignee, title, content, status, labels = [] }) {
    if (assignee !== undefined) {
      await this.chooseOption("Assignee", assignee);
    }
    if (title !== undefined) {
      await this.titleInput.fill(title);
    }
    if (content !== undefined) {
      await this.contentInput.fill(content);
    }
    if (status !== undefined) {
      await this.chooseOption("Status", status);
    }
    await this.chooseLabels(labels);
  }

  async startCreate() {
    await this.open();
    await this.createLink.click();
  }

  async create(task) {
    await this.startCreate();
    await this.fillForm(task);
    await this.saveButton.click();
  }

  async openForEdit(title) {
    await this.open();
    await this.card(title).getByRole("link", { name: "Edit" }).click();
  }

  async openDetails(title) {
    await this.open();
    await this.card(title).getByRole("link", { name: "Show" }).click();
  }

  async update(title, changes) {
    await this.openForEdit(title);
    await this.fillForm(changes);
    await this.saveButton.click();
  }

  async delete(title) {
    await this.openForEdit(title);
    await this.deleteButton.click();
  }

  async filterBy(filterName, optionName) {
    await this.open();
    await this.chooseOption(filterName, optionName);
  }

  async moveTask(title, statusName) {
    const source = await this.card(title).boundingBox();
    const target = await this.column(statusName).boundingBox();
    const startX = source.x + source.width / 2;
    const startY = source.y + source.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + 10, startY, { steps: 5 });
    await this.page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, {
      steps: 20,
    });
    await this.page.mouse.up();
  }
}
