const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function userKeyboardInputHandler(input) {
  const number = parseInt(input, 10);
  if (isNaN(number) || number < 1 || number > 9) {
    console.log('1~9 사이의 숫자를 입력하세요.');
  } else {
    console.log(`${number}단:`);
    for (let i = 1; i <= 9; i++) {
      console.log(`${number} x ${i} = ${number * i}`);
    }
  }

  rl.close();
}

rl.question('구구단을 입력하세요: ', userKeyboardInputHandler);
