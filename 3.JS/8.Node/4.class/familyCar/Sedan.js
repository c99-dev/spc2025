import Car from './Car.js';

class Sedan extends Car {
  constructor(brand, model, color, trunkSize) {
    super(brand, model, color, trunkSize);
    this.maxPassengers = 5;
  }
}

export default Sedan;
