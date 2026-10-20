// Общие элементы закрытой части приложения: шапка, боковое меню, уведомления.
export default class BasePage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.getByRole("banner").getByRole("heading");
    this.notification = page.getByRole("alert");
    this.undoButton = page.getByRole("button", { name: "Undo" });
  }

  menuItem(name) {
    return this.page.getByRole("menuitem", { name, exact: true });
  }

  async openSection(name) {
    await this.menuItem(name).click();
  }

  // Имя выпадающего списка складывается из подписи и выбранного значения.
  combobox(fieldLabel) {
    return this.page.getByRole("combobox", { name: new RegExp(`^${fieldLabel}`) });
  }

  async chooseOption(fieldLabel, optionName) {
    await this.combobox(fieldLabel).click();
    await this.page.getByRole("option", { name: optionName, exact: true }).click();
  }

  async undo() {
    await this.undoButton.click();
  }
}
