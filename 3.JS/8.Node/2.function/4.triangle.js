const rows = 5;

function leftTriangleAsc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = 1; j <= i; j++) {
      temp += '*';
    }
    console.log(temp);
  }
}

function leftTriangleDesc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = rows; j >= i; j--) {
      temp += '*';
    }
    console.log(temp);
  }
}

function rightTriangleAsc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = rows - 1; j >= i; j--) {
      temp += ' ';
    }
    for (let j = 1; j <= i; j++) {
      temp += '*';
    }
    console.log(temp);
  }
}

function rightTriangleDesc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = 1; j < i; j++) {
      temp += ' ';
    }
    for (let j = rows; j >= i; j--) {
      temp += '*';
    }
    console.log(temp);
  }
}

function isoscelesTriangleAsc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = rows - 1; j >= i; j--) {
      temp += ' ';
    }
    for (let j = 1; j <= 2 * (i - 1) + 1; j++) {
      temp += '*';
    }
    console.log(temp);
  }
}

function isoscelesTriangleDesc() {
  for (let i = 1; i <= rows; i++) {
    let temp = '';
    for (let j = 1; j < i; j++) {
      temp += ' ';
    }
    for (let j = rows * 2 - i; j >= i; j--) {
      temp += '*';
    }
    console.log(temp);
  }
}

leftTriangleAsc();
console.log('');
leftTriangleDesc();
console.log('');
rightTriangleAsc();
console.log('');
rightTriangleDesc();
console.log('');
isoscelesTriangleAsc();
console.log('');
isoscelesTriangleDesc();
