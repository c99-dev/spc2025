const Person = require('./Person.js');
const Employee = require('./Employee.js');
const Student = require('./Student.js');

const person = new Person('홍길동');
console.log(person.greet());

const student = new Student('김철수', '컴퓨터공학과');
console.log(student.greet());

const employee = new Employee('최성호', '개발자');
console.log(employee.greet());
