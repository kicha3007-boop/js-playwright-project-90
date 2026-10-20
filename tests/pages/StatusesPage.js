import ResourcePage from "./ResourcePage.js";

export default class StatusesPage extends ResourcePage {
  constructor(page) {
    super(page, {
      section: "Task statuses",
      fields: {
        name: "Name",
        slug: "Slug",
      },
    });
  }
}
