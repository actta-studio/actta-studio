import Component from "@/classes/Component";

export default class Cursor extends Component {
  constructor() {
    super({
      id: "cursor",
      element: "#cursor",
    });

    this.clientX = 0;
    this.clientY = 0;
    this.hasHover = window.matchMedia("(hover: hover)").matches;

    if (this.hasHover) {
      this.addEventListeners();
    } else {
      this.hideCursor();
    }
  }

  onMouseMove(e) {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.updateCursor();
  }

  updateCursor() {
    if (!this.hasHover) return;
    this.element.style.transform = `translate3d(${this.clientX}px, ${this.clientY}px, 0)`;
  }

  hideCursor() {
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  addEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
  }

  destroy() {
    super.destroy();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removeEventListeners();
  }
}
