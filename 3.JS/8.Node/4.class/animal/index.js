const Animal = require('./Animal.js');
const Dog = require('./Dog.js');
const Cat = require('./Cat.js');

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
