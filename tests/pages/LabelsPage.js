import ResourcePage from "./ResourcePage.js";

export default class LabelsPage extends ResourcePage {
  constructor(page) {
    super(page, {
      section: "Labels",
      fields: {
        name: "Name",
      },
    });
  }
}
