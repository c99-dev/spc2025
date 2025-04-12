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
}

export default Parent;
