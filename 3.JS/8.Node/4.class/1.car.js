class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  getDetails() {
    return `${this.brand} ${this.model}`;
  }
}

const myCar = new Car('Toyota', 'Corolla');
const myNewCar = new Car('Tesla', 'Model S');

console.log(typeof myCar);
console.log(myCar instanceof Error);
console.log(myCar instanceof Car);

console.log(myCar.getDetails());
console.log(myNewCar.getDetails());
