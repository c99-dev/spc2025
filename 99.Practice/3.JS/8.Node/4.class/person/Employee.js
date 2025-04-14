const Person = require('./Person.js');

const Employee = class extends Person {
  constructor(name, jobTitle) {
    super(name);
    this.jobTitle = jobTitle;
  }

  greet() {
    return `${this.name}: 내 직업은 ${this.jobTitle}.`;
  }
};

module.exports = Employee;
