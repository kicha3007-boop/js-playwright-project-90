import BasePage from "./BasePage.js";

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByRole("textbox", { name: "Username", exact: true });
    this.passwordInput = page.getByRole("textbox", { name: "Password", exact: true });
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.profileButton = page.getByRole("button", { name: "Profile" });
    this.logoutItem = page.getByRole("menuitem", { name: "Logout" });
    this.dashboardContent = page.getByText("Lorem ipsum sic dolor amet...");
  }

  async open() {
    await this.page.goto("/#/login");
  }

  async login({ username, password }) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async signIn(credentials) {
    await this.open();
    await this.login(credentials);
    await this.dashboardContent.waitFor();
  }

  async logout() {
    await this.profileButton.click();
    await this.logoutItem.click();
  }
}
