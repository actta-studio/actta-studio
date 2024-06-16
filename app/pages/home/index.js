import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

import Page from "../../classes/Page";

gsap.registerPlugin(CustomEase);

CustomEase.create("custom", "M0,0 C0.65,0, 0.35,1, 1,1");

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".page--home",
      elements: {
        about: ".page--home .about .text",
        services: ".page--home .services span",
        logo: ".page--home .logo",
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

      this.animateIn
        .from(this.elements.get("about"), {
          autoAlpha: 0,
          yPercent: 100,
          stagger: 0.075,
        })
        .from(
          this.elements.get("services"),
          {
            autoAlpha: 0,
            yPercent: 100,
            stagger: 0.075,
          },
          "<"
        );

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

      this.animateOut
        .to(this.elements.get("about"), {
          autoAlpha: 0,
          yPercent: -100,
          stagger: 0.075,
        })
        .to(
          this.elements.get("services"),
          {
            autoAlpha: 0,
            yPercent: -100,
            stagger: 0.075,
          },
          "<"
        );

      this.animateOut.call(() => {
        resolve();
      });
    });
  }

  create({ sourcePreloader }) {
    this.sourcePreloader = sourcePreloader;
    super.create();
    this.addEventListeners();
  }

  createAnimations() {}

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
  }
}
