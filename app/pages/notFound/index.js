import { map } from "lodash";

import Page from "../../classes/Page";

export default class NotFound extends Page {
  constructor() {
    super({
      id: "notFound",
      element: ".page--notFound",
      elements: {},
    });
  }

  show() {
    super.show();
  }

  create({ sourcePreloader }) {
    this.sourcePreloader = sourcePreloader;

    super.create();
    // this.createAnimations();
    this.addEventListeners();
  }

  createAnimations() {}

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
  }
}
