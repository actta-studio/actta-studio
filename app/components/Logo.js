import Component from "@/classes/Component";

export default class Logo extends Component {
  constructor() {
    super({
      id: "logo",
      element: "#logo",
    });

    this.style = getComputedStyle(this.element);
    this.loop = this.loop.bind(this);
    this.loop();

    this.lastBounce = { x: null, y: null };
    this.scrollSpeed = 0.2;
  }

  loop() {
    const marginLeft = parseInt(this.style.marginLeft);
    const marginRight = parseInt(this.style.marginRight);
    const marginTop = parseInt(this.style.marginTop);
    const marginBottom = parseInt(this.style.marginBottom);

    const hRange =
      window.innerWidth - this.element.clientWidth - marginLeft - marginRight;
    const vRange =
      window.innerHeight - this.element.clientHeight - marginTop - marginBottom;

    const time = performance.now() * this.scrollSpeed;

    const x = Math.abs((time % (hRange * 2)) - hRange);
    const y = Math.abs((time % (vRange * 2)) - vRange);

    this.element.style.transform = `translate(${x}px, ${y}px)`;

    const epsilon = 10;

    if (
      Math.abs(x) <= epsilon ||
      Math.abs(x - hRange) <= epsilon ||
      Math.abs(y) <= epsilon ||
      Math.abs(y - vRange) <= epsilon
    ) {
      if (this.lastBounce.x !== x || this.lastBounce.y !== y) {
        this.lastBounce = { x, y };
        this.emit("bounce", { x, y });
      }
    }

    requestAnimationFrame(this.loop);
  }
}
