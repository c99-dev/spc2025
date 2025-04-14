import Person from './Person.js';

class Employee extends Person {
  constructor(name, jobTitle) {
    super(name);
    this.jobTitle = jobTitle;
  }

  getJobTitle() {
    return this.jobTitle;
  }

  greet() {
    return `${this.getName()}: 내 직업은 ${this.getJobTitle()}.`;
  }
}

export default Employee;
