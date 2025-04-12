import Car from './Car.js';

class Sedan extends Car {
  #color;
  #trunkSize;

  constructor(brand, model, color, trunkSize) {
    super(brand, model);
    this.#color = color;
    this.#trunkSize = trunkSize;
  }

  get color() {
    return this.#color;
  }

  get trunkSize() {
    return this.#trunkSize;
  }

  toString() {
    return `Sedan { brand: '${this.brand}', model: '${this.model}', color: '${this.color}', trunkSize: ${this.trunkSize} }`;
  }
}

export default Sedan;
