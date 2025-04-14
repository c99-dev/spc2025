class Person {
  #name;
  #age;
  #gender;

  constructor(name, age, gender) {
    this.#name = name;
    this.#age = age;
    this.#gender = gender;
  }

  get name() {
    return this.#name;
  }

  get age() {
    return this.#age;
  }

  get gender() {
    return this.#gender;
  }

  getInCar(car) {
    const success = car.addPassenger(this);
    if (success) {
      console.log(`${this.#name}이(가) ${car.model}에 탑승했습니다.`);
      console.log(`${car}`);
    } else if (car.isRunning) {
      console.log(
        `${this.#name}이(가) ${
          car.model
        }에 탑승하지 못했습니다. 차량이 주행 중입니다.`
      );
    }
    return success;
  }

  driveCar(car) {
    if (this.constructor.name === 'Child') {
      console.log(`${this.name}은(는) 어린이이므로 운전할 수 없습니다.`);
      return false;
    }

    if (!car.passengers.some((p) => p.name === this.name)) {
      console.log(
        `${this.name}은(는) ${car.model}에 탑승하지 않았습니다. 먼저 탑승하세요.`
      );
      return false;
    }

    console.log(`${this.name}이(가) ${car.model}를 운전하고 있습니다.`);
    car.drive();
    return true;
  }
}

export default Person;
