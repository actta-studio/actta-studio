import "../styles/main.scss";

import each from "lodash/each";

import Home from "@/pages/home";
import NotFound from "@/pages/notFound";

import Preloader from "@/components/preloader";
import Grid from "@/components/grid";
import Squares from "@/components/squares";
import Logo from "@/components/logo";
import LanguageToggle from "./components/LanguageToggle";
import Navigation from "./components/Navigation";

class App {
  constructor() {
    this.createContent();

    this.createNavigation();
    this.createPages();
    this.createLanguageToggle();

    this.createGrid();

    this.addLinkListeners();
    this.addEventListeners();
  }

  createPages() {
    this.pages = new Map();

    this.pages.set("home", new Home());
    this.pages.set("404", new NotFound());

    this.page = this.pages.get(this.template);

    this.page.create({ sourcePreloader: false });
    this.page.show();
    this.navigation.show();
  }

  createContent() {
    this.content = document.querySelector("#content");
    this.template = this.content.getAttribute("data-template");
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createLanguageToggle() {
    this.toggle = new LanguageToggle();
  }

  createNavigation() {
    this.navigation = new Navigation();
  }

  createGrid() {
    this.grid = new Grid();
  }

  createSquares() {
    this.squares = new Squares();
  }

  initLogoAnimation() {
    this.logo = new Logo();
  }

  async onChange({ url, push = true }) {
    if (url === window.location.href) return;

    await this.page.hide();

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

    const newLanguageToggle = div.querySelector(".link--language");
    const newTitle = div.querySelector(".header--navigation .title");
    const currentLanguageToggle = document.querySelector(".link--language");
    const currentTitle = document.querySelector(".header--navigation .title");

    if (currentLanguageToggle && newLanguageToggle) {
      this.toggle.hide();

      currentLanguageToggle.parentNode.replaceChild(
        newLanguageToggle,
        currentLanguageToggle
      );

      this.toggle.show();
    }

    if (currentTitle && newTitle) {
      newTitle.classList.add("title--animated");
      currentTitle.parentNode.replaceChild(newTitle, currentTitle);
    }

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
