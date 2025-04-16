class Person {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  greet() {
    return `${this.name}: 안녕하세요`;
  }
}

export default Person;
