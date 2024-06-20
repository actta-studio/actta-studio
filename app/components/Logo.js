import Component from "@/classes/Component";

export default class Logo extends Component {
  constructor() {
    super({
      id: "logo",
      element: "#logo",
    });

    this.squares = Array.from(document.querySelectorAll(".square"));
    this.style = getComputedStyle(this.element);
    this.loop = this.loop.bind(this);
    this.loop();

    this.lastBounce = { x: null, y: null };

    this.circles = [
      { x: 0, y: 0, side: "top" },
      { x: 0, y: 0, side: "right" },
      { x: 0, y: 0, side: "bottom" },
      { x: 0, y: 0, side: "left" },
    ];

    this.closestSquares = this.circles.map(() => ({
      distance: Infinity,
      index: null,
    }));

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

        this.circles[0].x = x + this.element.clientWidth * 0.62;
        this.circles[0].y = y;
        this.circles[1].x = x + this.element.clientWidth;
        this.circles[1].y = y + this.element.clientHeight * 0.3;
        this.circles[2].x = x + this.element.clientWidth * 0.3;
        this.circles[2].y = y + this.element.clientHeight;
        this.circles[3].x = x;
        this.circles[3].y = y + this.element.clientHeight * 0.62;

        this.closestSquares.forEach((closest) => {
          closest.distance = Infinity;
          closest.index = null;
        });

        this.squares.forEach((square) => {
          const rect = square.getBoundingClientRect();

          this.circles.forEach((circle, i) => {
            if (
              (Math.abs(x) <= epsilon && circle.side === "left") ||
              (Math.abs(x - hRange) <= epsilon && circle.side === "right") ||
              (Math.abs(y) <= epsilon && circle.side === "top") ||
              (Math.abs(y - vRange) <= epsilon && circle.side === "bottom")
            ) {
              const distance = Math.hypot(
                circle.x - (rect.left + rect.right) / 2,
                circle.y - (rect.top + rect.bottom) / 2
              );

              if (
                distance < this.closestSquares[i].distance &&
                circle.x >= rect.left &&
                circle.x <= rect.right &&
                circle.y >= rect.top &&
                circle.y <= rect.bottom
              ) {
                this.closestSquares[i] = {
                  distance,
                  index: square.getAttribute("data-index"),
                };
              }
            }
          });
        });

        // Sort the closestSquares array by the distance property
        this.closestSquares.sort((a, b) => a.distance - b.distance);

        // Only emit the "bounce" event for the square with the smallest distance
        let closestIndex = this.closestSquares[0].index;

        // If the logo is bouncing on an edge, choose only one square to emit the "bounce" event for
        if (
          this.closestSquares[0].distance === this.closestSquares[1].distance
        ) {
          closestIndex = Math.min(
            parseInt(this.closestSquares[0].index),
            parseInt(this.closestSquares[1].index)
          );
        }

        if (closestIndex !== null) {
          this.emit("bounce", closestIndex);
        }
      }
    }

    requestAnimationFrame(this.loop);
  }
}
