import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { splitC } from "@/utils/text";
import { each } from "lodash";

import Page from "../../classes/Page";

gsap.registerPlugin(CustomEase);

CustomEase.create("custom", "M0,0 C0.65,0, 0.35,1, 1,1");

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".page--home",
      elements: {
        lines: "[data-animation='type']",
        about: ".page--home .about .text",
        services: ".page--home .services .line",
        logo: ".page--home .logo",
      },
    });
  }

  show() {
    return new Promise((resolve) => {
      let animationsCompleted = 0;
      const lines = this.elements.get("lines");

      if (lines.length === 0) {
        resolve();
        return;
      }

      each(this.elements.get("lines"), (element) => {
        const characters = Array.from(element.querySelectorAll(".c"));
        animationsCompleted += characters.length;

        gsap.to(characters, {
          "--scale": 0,
          ease: "steps(1)",
          stagger: {
            each: 0.05 / 2,
            from: "start",
          },
          onComplete: () => {
            animationsCompleted -= 1;
            if (animationsCompleted === 0) {
              resolve();
            }
          },
        });
      });
    });
  }

  hide() {
    // return new Promise((resolve) => {
    //   let animationsCompleted = 0;
    //   const lines = this.elements.get("lines");
    //   if (lines.length === 0) {
    //     resolve();
    //     return;
    //   }
    //   each(this.elements.get("lines"), (element) => {
    //     const characters = Array.from(element.querySelectorAll(".c"));
    //     animationsCompleted += characters.length;
    //     gsap.to(characters, {
    //       "--scale": 1,
    //       ease: "steps(1)",
    //       stagger: {
    //         each: 0.05 / 2,
    //         from: "start",
    //       },
    //       onComplete: () => {
    //         animationsCompleted -= 1;
    //         if (animationsCompleted === 0) {
    //           resolve();
    //         }
    //       },
    //     });
    //   });
    // });
  }

  create({ sourcePreloader }) {
    this.sourcePreloader = sourcePreloader;
    super.create();
    this.addEventListeners();

    each(this.elements.get("lines"), (element) => {
      splitC({
        element: element,
      });
    });
  }

  createAnimations() {}

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
  }
}
