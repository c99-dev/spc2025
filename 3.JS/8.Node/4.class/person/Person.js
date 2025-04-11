class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `${this.name}: 안니영`;
  }
}

module.exports = Person;
