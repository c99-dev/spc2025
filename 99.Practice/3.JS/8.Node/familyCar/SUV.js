import Car from './Car.js';

class SUV extends Car {
  constructor(brand, model, color, trunkSize) {
    super(brand, model, color, trunkSize);
    this.maxPassengers = 7;
  }
}

export default SUV;
