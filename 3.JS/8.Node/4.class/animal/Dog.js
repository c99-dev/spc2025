const Animal = require('./Animal.js');

class Dog extends Animal {
  makeSound() {
    return `${this.name} 멍멍`;
  }
}

module.exports = Dog;
