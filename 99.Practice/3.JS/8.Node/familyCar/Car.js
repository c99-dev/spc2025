class Car {
  #brand;
  #model;
  #isStarted = false;
  #isRunning = false;

  constructor(brand, model) {
    this.#brand = brand;
    this.#model = model;
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
    console.log(`${this.#brand} ${this.#model}을(를) 운전하고 있습니다.`);
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
    return `${this.#brand} ${this.#model}`;
  }
}

export default Car;
