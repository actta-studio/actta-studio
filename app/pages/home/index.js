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
      const lines = Array.from(
        document.querySelectorAll("[data-animation='type']")
      );

      if (lines.length === 0) {
        resolve();
        return;
      }

      const masterTimeline = gsap.timeline({
        // onComplete: () => {
        //   console.log("All lines animation completed");
        //   document
        //     .querySelector(".link--language a")
        //     .removeAttribute("data-state");
        //   resolve();
        // },
      });

      lines.forEach((element, lineIndex) => {
        const characters = Array.from(element.querySelectorAll(".c"));
        const lineTimeline = gsap.timeline();

        const minDuration = 0.2;
        const maxDuration = 0.4;
        const totalAnimationDuration = Math.max(
          minDuration,
          Math.min(maxDuration, characters.length * 0.025)
        );
        const delayIncrement = totalAnimationDuration / characters.length;

        gsap.set(characters, {
          "--scale": 1,
        });

        characters.forEach((character, index) => {
          lineTimeline.to(
            character,
            {
              autoAlpha: 1,
              ease: "steps(1)",
              duration: delayIncrement,
            },
            index * delayIncrement
          );
        });

        masterTimeline.add(lineTimeline, lineIndex === 0 ? 0 : ">");
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline();

      this.animateOut.to(
        this.elements.get([".page--home .about", ".page--home .services"]),
        {
          autoAlpha: 0,
          duration: 0.3,
        }
      );

      this.animateOut.call(() => {
        this.destroy();
        resolve();
      });
    });
  }

  create({ sourcePreloader }) {
    this.sourcePreloader = sourcePreloader;
    super.create();
    this.addEventListeners();

    each(this.elements.get("lines"), (element) => {
      // if element contains an svg dont split
      if (element.querySelector("svg") !== null) return;

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
