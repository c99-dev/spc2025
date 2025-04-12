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
}

export default Person;
