import Person from './Person.js';

class Parent extends Person {
  #job;

  constructor(name, age, gender, job) {
    super(name, age, gender);
    this.#job = job;
  }

  get job() {
    return this.#job;
  }

  getInCar(car) {
    console.log(`${this.name}이(가) ${car.model}에 탑승했습니다.`);
    console.log(`${car}`);
  }

  driveCar(car) {
    console.log(`${this.name}이(가) ${car.model}를 운전하고 있습니다.`);
    car.drive();
  }
}

export default Parent;
