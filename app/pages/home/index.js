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
    console.log("show");
    return new Promise((resolve) => {
      const lines = Array.from(
        document.querySelectorAll("[data-animation='type']")
      );

      if (lines.length === 0) {
        resolve();
        return;
      }

      const totalAnimationDuration = 1.5;

      const animationPromises = lines.map((element) => {
        return new Promise((resolveLine) => {
          const characters = Array.from(element.querySelectorAll(".c"));
          let completedAnimations = 0;

          const delayIncrement = totalAnimationDuration / characters.length;

          gsap.set(characters, {
            "--scale": 1,
          });

          characters.forEach((character, index) => {
            gsap.to(character, {
              "--scale": 0,
              ease: "steps(1)",
              delay: index * delayIncrement, // Use the new delay increment
              onComplete: () => {
                completedAnimations++;
                if (completedAnimations === characters.length) {
                  console.log(`Line animation completed.`);
                  resolveLine();
                }
              },
            });
          });
        });
      });

      Promise.all(animationPromises).then(() => {
        console.log("All lines animation completed");
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      let animationsCompleted = 0;
      const lines = Array.from(
        document.querySelectorAll("[data-animation='type']")
      );

      if (lines.length === 0) {
        resolve();
        return;
      }

      lines.forEach((element) => {
        const characters = Array.from(element.querySelectorAll(".c")).reverse(); // Reverse the array
        animationsCompleted += characters.length;

        characters.forEach((character, index) => {
          gsap.to(character, {
            "--scale": 1,
            ease: "steps(1)",
            delay: index * 0.025,
            onComplete: () => {
              animationsCompleted--;
              if (animationsCompleted === 0) {
                resolve();
              }
            },
          });
        });
      });
    });
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
