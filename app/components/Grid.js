export default class Grid {
  constructor() {
    this.sizes = [
      { condition: "<=430", config: { count: 12, gutter: 10, margin: 15 } },
      { condition: "<=768", config: { count: 12, gutter: 10, margin: 20 } },
      { condition: ">768", config: { count: 12, gutter: 20, margin: 40 } },
    ];

    this.currentSize = null;

    this.update();
    this.addEventListeners();
  }

  create({ count, gutter, margin }) {
    if (this.grid) {
      this.grid.remove();
    }

    this.grid = document.createElement("div");
    this.grid.classList.add("design-grid");
    this.grid.style.setProperty("--gutter", `${gutter / 10}rem`);
    this.grid.style.setProperty("--margin", `${margin / 10}rem`);

    for (let i = 0; i < count; i++) {
      let div = document.createElement("div");
      div.classList.add("column");
      this.grid.appendChild(div);
    }

    document.body.appendChild(this.grid);
  }

  update() {
    const viewportWidth = window.innerWidth;

    const isVisible =
      this.grid && this.grid.classList.contains("design-grid--visible");

    const sortedSizes = this.sizes.sort((a, b) => {
      const aValue = parseInt(a.condition.match(/\d+/)[0], 10);
      const bValue = parseInt(b.condition.match(/\d+/)[0], 10);
      return bValue - aValue;
    });

    for (const size of sortedSizes) {
      const [operator, valueStr] = size.condition
        .match(/([<>=]+)(\d*)/)
        .slice(1);

      const value = parseInt(valueStr, 10);

      let match = false;

      switch (operator) {
        case "<=":
          match = viewportWidth <= value;
          break;
        case ">=":
          match = viewportWidth >= value;
          break;
        case "<":
          match = viewportWidth < value;
          break;
        case ">":
          match = viewportWidth > value;
          break;
        default:
          console.warn("Unsupported operator:", operator);
          break;
      }

      if (match) {
        this.create(size.config);

        if (isVisible) {
          this.grid.classList.add("design-grid--visible");
        }
      }
    }
  }

  show() {
    for (let i = 0; i < this.count; i++) {
      let div = document.createElement("div");
      div.classList.add("column");
      this.grid.appendChild(div);
    }
  }

  keydown(e) {
    if (e.key === "G" && e.shiftKey) {
      this.grid.classList.toggle("design-grid--visible");
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.update.bind(this));
    window.addEventListener("keydown", this.keydown.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener("resize", this.update.bind(this));
    window.removeEventListener("keydown", this.keydown.bind(this));
  }
}
