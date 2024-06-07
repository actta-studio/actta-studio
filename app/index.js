import "../styles/main.scss";

import each from "lodash/each";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

import Home from "@/pages/home";
import NotFound from "@/pages/notFound";

import Preloader from "@/components/preloader";
import Grid from "@/components/grid";
import Squares from "@/components/squares";
import Logo from "@/components/logo";

class App {
  constructor() {
    this.createContent();

    this.createPreloader();
    this.createPages();
    this.createSquares();
    // this.initLogoAnimation();

    if (process.env.NODE_ENV === "development") {
      this.createGrid();
    }

    this.addLinkListeners();
    this.addEventListeners();
  }

  createPages() {
    this.pages = new Map();

    this.pages.set("home", new Home());
    this.pages.set("404", new NotFound());

    this.page = this.pages.get(this.template);

    this.page.create({ sourcePreloader: true });
    // this.page.show();
  }

  createContent() {
    this.content = document.querySelector("#content");
    this.template = this.content.getAttribute("data-template");
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createGrid() {
    this.grid = new Grid(12);
  }

  createSquares() {
    this.squares = new Squares();
  }

  onPreloaded() {
    window.scrollTo(0, 0);
    this.preloader.destroy();
    this.page.show();
  }

  initLogoAnimation() {
    this.logo = new Logo();
    // this.logo.on("bounce", (value) => {
    //   console.log(value);
    //   this.squares.onBounce(value);
    // });
  }

  async onChange({ url, push = true }) {
    if (url === window.location.href) return;

    if (url.includes("/shop") && window.location.href.includes("/shop")) {
      await this.pages.get("shop").animateOutProducts();
    }

    window.scrollTo(0, 0);

    this.page.hide();

    const request = await window.fetch(url);

    const html = await request.text();
    const div = document.createElement("div");
    if (push) {
      window.history.pushState({}, "", url);
    }

    div.innerHTML = html;
    const divContent = div.querySelector("#content");
    this.template = divContent.getAttribute("data-template");

    this.content.setAttribute(
      "data-template",
      divContent.getAttribute("data-template")
    );

    this.content.innerHTML = divContent.innerHTML;

    this.page = this.pages.get(this.template);

    if (!this.page) {
      this.page = this.pages.get("404");
    }

    this.page.create({ sourcePreloader: false });
    this.page.show();
    this.addLinkListeners();
  }

  async onPopState() {
    await this.onChange({ url: window.location.pathname, push: false });
  }

  addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener("popstate", this.onPopState.bind(this));
  }

  addLinkListeners() {
    const allLinks = document.querySelectorAll("a");
    const disabledLinks = document.querySelectorAll("a[data-state='disabled']");

    each(disabledLinks, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
      };
    });

    const links = Array.from(allLinks).filter(
      (link) =>
        link.getAttribute("data-state") !== "disabled" &&
        link.getAttribute("data-link") !== "external"
    );

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;

        this.onChange({ url: href });
      };
    });
  }
}

new App();
