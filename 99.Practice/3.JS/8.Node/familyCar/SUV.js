import Car from './Car.js';

class SUV extends Car {
  #color;
  #capacity;

  constructor(brand, model, color, capacity) {
    super(brand, model);
    this.#color = color;
    this.#capacity = capacity;
  }

  get color() {
    return this.#color;
  }

  get capacity() {
    return this.#capacity;
  }

  toString() {
    return `SUV { brand: '${this.brand}', model: '${this.model}', color: '${this.color}', capacity: ${this.capacity} }`;
  }
}

export default SUV;
