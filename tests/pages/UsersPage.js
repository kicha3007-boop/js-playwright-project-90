import ResourcePage from "./ResourcePage.js";

export default class UsersPage extends ResourcePage {
  constructor(page) {
    super(page, {
      section: "Users",
      fields: {
        email: "Email",
        firstName: "First name",
        lastName: "Last name",
      },
    });
  }
}
