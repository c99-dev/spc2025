function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return 'Cannot divide by zero';
  }
  return a / b;
}

function printScreen(text) {
  console.log(text);
}

printScreen(add(2, 3));
printScreen(subtract(2, 3));
printScreen(multiply(2, 3));
printScreen(divide(2, 3));
printScreen(multiply(2, 0));
printScreen(divide(2, 0));
