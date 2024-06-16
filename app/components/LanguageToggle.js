import each from "lodash/each";
import gsap from "gsap";

import Component from "@/classes/Component";
import { split } from "../utils/text";
import { delay } from "lodash";

export default class LanguageToggle extends Component {
  constructor() {
    super({
      id: "language-toggle",
      element: ".link--language",
    });
  }

  splitText() {
    split({
      element: this.element,
      expression: /(.)/g,
      append: false,
    });
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn = gsap.timeline();
      this.animateIn.from(".link--language .wrap", {
        translateY: -30,
        duration: 0.6,

        ease: "power4.inOut",
      });

      this.animateIn.call(() => {
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline();

      this.animateOut.to(".link--language .wrap", {
        translateY: 30,
        duration: 0.6,
        ease: "power4.inOut",
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
    this.element.parentNode.removeChild(this.element);
  }
}
