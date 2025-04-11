class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    return '아무소리나냄';
  }
}

class Dog extends Animal {
  makeSound() {
    return `${this.name} 멍멍`;
  }
}

class Cat extends Animal {
  makeSound() {
    return `${this.name} 야옹`;
  }
}

const animal = new Animal('동물');
const aSound = animal.makeSound();
console.log(aSound);

const aDog = new Dog('강아지');
const aDogSound = aDog.makeSound();
console.log(aDogSound);

const bdog = new Dog('불독');
const bDogSound = bdog.makeSound();
console.log(bDogSound);

const addog = new Cat('고양이');
const aCatSound = addog.makeSound();
console.log(aCatSound);
