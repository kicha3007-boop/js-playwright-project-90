import BasePage from "./BasePage.js";

// Раздел react-admin со списком-таблицей и формами создания и правки:
// пользователи, статусы и метки устроены одинаково и различаются только
// пунктом меню и набором полей формы.
export default class ResourcePage extends BasePage {
  constructor(page, { section, fields }) {
    super(page);
    this.section = section;
    this.fields = fields;
    this.createLink = page.getByRole("link", { name: "Create" });
    this.table = page.getByRole("table");
    this.columnHeaders = this.table.getByRole("columnheader");
    this.rows = this.table.locator("tbody").getByRole("row");
    this.selectAllCheckbox = page.getByRole("checkbox", { name: "Select all" });
    this.selectedCounter = page.getByRole("heading", { name: /selected$/ });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.emptyListMessage = page.getByText(`No ${section} yet.`);
  }

  async open() {
    await this.openSection(this.section);
  }

  input(field) {
    return this.page.getByRole("textbox", { name: this.fields[field], exact: true });
  }

  fieldError(message) {
    return this.page.getByRole("main").getByText(message, { exact: true });
  }

  row(text) {
    return this.rows.filter({ has: this.page.getByRole("cell", { name: text, exact: true }) });
  }

  rowCheckbox(text) {
    return this.row(text).getByRole("checkbox");
  }

  async startCreate() {
    await this.open();
    await this.createLink.click();
  }

  async fillForm(record) {
    for (const field of Object.keys(this.fields)) {
      if (record[field] !== undefined) {
        await this.input(field).fill(record[field]);
      }
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async create(record) {
    await this.startCreate();
    await this.fillForm(record);
    await this.save();
  }

  async openRecord(text) {
    await this.open();
    await this.row(text).getByRole("cell", { name: text, exact: true }).click();
  }

  async update(text, changes) {
    await this.openRecord(text);
    await this.fillForm(changes);
    await this.save();
  }

  async delete(text) {
    await this.openRecord(text);
    await this.deleteButton.click();
  }

  async selectRows(texts) {
    for (const text of texts) {
      await this.rowCheckbox(text).check();
    }
  }

  async selectAll() {
    await this.selectAllCheckbox.check();
  }

  async deleteSelected() {
    await this.deleteButton.click();
  }
}
