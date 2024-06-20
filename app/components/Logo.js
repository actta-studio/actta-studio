import Component from "@/classes/Component";

export default class Logo extends Component {
  constructor() {
    super({
      id: "logo",
      element: "#logo",
      elements: { path: "#logo path" },
    });

    this.style = getComputedStyle(this.element);
    this.loop = this.loop.bind(this);
    this.loop();

    this.colors = [
      "#2CCE3E",
      "#CE2CA1",
      "#32D2E7",
      "#FFF624",
      "#FF3124",
      "#8951FF",
    ];

    this.currentColorIndex = 0;

    // this.changeColor();

    this.lastBounce = { x: null, y: null };
    this.scrollSpeed = 0.2;
  }

  changeColor() {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    this.elements.get("path").style.fill = this.colors[this.currentColorIndex];
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
    const bounceThreshold = 100; // Time in milliseconds to wait before logging another bounce

    if (
      (Math.abs(x) <= epsilon ||
        Math.abs(x - hRange) <= epsilon ||
        Math.abs(y) <= epsilon ||
        Math.abs(y - vRange) <= epsilon) &&
      (!this.lastBounce.time ||
        performance.now() - this.lastBounce.time > bounceThreshold)
    ) {
      console.log("Bounce");
      this.lastBounce = { x, y, time: performance.now() };

      this.changeColor();
    }

    requestAnimationFrame(this.loop);
  }
}
