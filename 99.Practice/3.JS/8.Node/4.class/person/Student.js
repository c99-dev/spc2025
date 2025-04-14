const Person = require('./Person.js');

class Student extends Person {
  constructor(name, major) {
    super(name);
    this.major = major;
  }

  greet() {
    return `${this.name}: 내 전공은 ${this.major}.`;
  }
}

module.exports = Student;
