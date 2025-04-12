import Person from './Person.js';

class Child extends Person {
  #grade;

  constructor(name, age, gender, grade) {
    super(name, age, gender);
    this.#grade = grade;
  }

  get grade() {
    return this.#grade;
  }

  getInCar(car) {
    console.log(`${this.name}이(가) ${car.model}에 탑승했습니다.`);
    console.log(`${car}`);
  }

  playInCar() {
    console.log(`${this.name}이(가) 차 안에서 장난을 치고 있습니다.`);
  }
}

export default Child;
