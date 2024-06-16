import each from "lodash/each";
import gsap from "gsap";

import Component from "../classes/Component";

export default class Squares extends Component {
  constructor() {
    super({
      id: "squares",
      element: ".squares",
    });

    this.squares = [];
    this.columns = 12;
    this.squareSize = window.innerWidth / this.columns;
    this.rows = Math.ceil(window.innerHeight / this.squareSize);

    this.addSquares();

    this.addEventListeners = this.addEventListeners.bind(this);

    this.addEventListeners();
  }

  addSquares() {
    this.squareCount = this.rows * this.columns;

    for (let i = 0; i < this.squareCount; i++) {
      const square = document.createElement("div");
      square.classList.add(`square`);
      square.dataset.index = i;
      this.element.appendChild(square);
    }
  }

  getCoordinates(index) {
    return {
      row: Math.floor(index / this.columns),
      column: index % this.columns,
    };
  }

  getIndex(row, column) {
    return row * this.columns + column;
  }

  getNeighbors(row, column) {
    const neighbors = [];

    neighbors.push(this.getIndex(row, column));

    // // Above
    // if (row > 0) {
    //   neighbors.push(this.getIndex(row - 1, column));
    // }

    // // Below
    // if (row < this.rows - 1) {
    //   neighbors.push(this.getIndex(row + 1, column));
    // }

    // // Left
    // if (column > 0) {
    //   neighbors.push(this.getIndex(row, column - 1));
    // }

    // // Right
    // if (column < this.columns - 1) {
    //   neighbors.push(this.getIndex(row, column + 1));
    // }

    return neighbors;
  }

  onBounce(targetIndex) {
    const { row, column } = this.getCoordinates(targetIndex);
    const neighbors = this.getNeighbors(row, column);

    const targets = neighbors
      .map((index) => `.square[data-index="${index}"]`)
      .filter(Boolean);

    gsap.to(targets, {
      keyframes: [{ opacity: 0 }, { opacity: 0.1 }, { opacity: 0 }],
      stagger: 0.075,
      overwrite: "auto",
    });
  }

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    super.destroy();
    this.element.parentNode.removeChild(this.element);
  }
}
