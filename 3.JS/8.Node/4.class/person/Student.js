import Person from './Person.js';

class Student extends Person {
  constructor(name, major) {
    super(name);
    this.major = major;
  }

  getMajor() {
    return this.major;
  }

  greet() {
    return `${this.getName()}: 내 전공은 ${this.getMajor()}.`;
  }
}

export default Student;
