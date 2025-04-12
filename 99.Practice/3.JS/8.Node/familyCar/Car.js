class Car {
  #brand;
  #model;
  #isStarted = false;
  #isRunning = false;
  #passengers = [];
  #maxPassengers = 4;
  #color;
  #trunkSize;

  constructor(brand, model, color = null, trunkSize = 0) {
    this.#brand = brand;
    this.#model = model;
    this.#color = color;
    this.#trunkSize = trunkSize;
  }

  get brand() {
    return this.#brand;
  }

  get model() {
    return this.#model;
  }

  get isStarted() {
    return this.#isStarted;
  }

  get isRunning() {
    return this.#isRunning;
  }

  get passengers() {
    return [...this.#passengers];
  }

  get maxPassengers() {
    return this.#maxPassengers;
  }

  set maxPassengers(value) {
    if (typeof value === 'number' && value > 0) {
      this.#maxPassengers = value;
    }
  }

  get color() {
    return this.#color;
  }

  get trunkSize() {
    return this.#trunkSize;
  }

  addPassenger(person) {
    if (this.#isRunning) {
      console.log(
        `${this.#brand} ${this.#model}이(가) 달리고 있어 탑승할 수 없습니다.`
      );
      return false;
    }

    if (this.#passengers.length >= this.#maxPassengers) {
      console.log(
        `${this.#brand} ${this.#model}에 더 이상 탑승할 수 없습니다. (최대 ${
          this.#maxPassengers
        }명)`
      );
      return false;
    }
    this.#passengers.push(person);
    return true;
  }

  removePassenger(person) {
    const index = this.#passengers.findIndex((p) => p.name === person.name);
    if (index !== -1) {
      this.#passengers.splice(index, 1);
      return true;
    }
    return false;
  }

  start() {
    if (this.#isStarted) {
      console.log(
        `${this.#brand} ${this.#model}이(가) 이미 시동이 걸려 있습니다.`
      );
      return false;
    }

    this.#isStarted = true;
    console.log(`${this.#brand} ${this.#model}이(가) 시동을 걸었습니다.`);
    return true;
  }

  drive() {
    if (!this.#isStarted) {
      console.log(`${this.#brand} ${this.#model}이(가) 시동이 꺼져 있습니다.`);
      return false;
    }

    this.#isRunning = true;
    return true;
  }

  stop() {
    if (!this.#isRunning) {
      console.log(`${this.#brand} ${this.#model}이(가) 이미 멈춰 있습니다.`);
      return false;
    }

    if (!this.#isStarted) {
      console.log(`${this.#brand} ${this.#model}이(가) 시동이 꺼져 있습니다.`);
      return false;
    }

    this.#isRunning = false;
    console.log(`${this.#brand} ${this.#model}이(가) 멈췄습니다.`);
    return true;
  }

  toString() {
    const passengersStr =
      this.#passengers.length > 0
        ? `탑승자: ${this.#passengers.map((p) => p.name).join(', ')}`
        : '탑승자 없음';

    const carTypeInfo =
      this.constructor.name !== 'Car'
        ? `${this.constructor.name} { color: '${this.color}', trunkSize: ${this.trunkSize} } - `
        : '';

    return `${carTypeInfo}${this.#brand} ${this.#model} (${passengersStr}, ${
      this.#passengers.length
    }/${this.#maxPassengers}명)`;
  }
}

export default Car;
