class Circle {
  #radius;

  constructor(radius) {
    this.#radius = radius;
  }

  get diameter() {
    return this.#radius * 2;
  }

  set diameter(diameter) {
    this.#radius = diameter / 2;
  }
}

const myCircle = new Circle(5);

console.log(myCircle.diameter);
myCircle.diameter = 14;
console.log(myCircle.diameter);
