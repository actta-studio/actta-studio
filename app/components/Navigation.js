import each from "lodash/each";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

import Component from "@/classes/Component";
import { split } from "../utils/text";

gsap.registerPlugin(CustomEase);

CustomEase.create("custom", "M0,0 C0.65,0, 0.35,1, 1,1");

export default class Navigation extends Component {
  constructor() {
    super({
      id: "navigation",
      element: ".header--navigation",
      elements: {
        title: ".header--navigation .title span",
      },
    });
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn = gsap.timeline({
        defaults: {
          ease: "power3.inOut",
        },
      });

      this.animateIn.from(this.elements.get("title"), {
        autoAlpha: 0,
        // yPercent: 100,
      });

      this.animateIn.call(() => {
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline({
        defaults: {
          ease: "power3.inOut",
        },
      });

      this.animateOut.to(this.elements.get("title"), {
        autoAlpha: 0,
        // yPercent: 100,
      });

      this.animateOut.call(() => {
        resolve();
      });
    });
  }

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
  }
}
