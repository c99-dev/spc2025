function gugudan() {
  for (let i = 1; i <= 9; i++) {
    console.log(`=== ${i}단 ===`);
    for (let j = 1; j <= 9; j++) {
      console.log(`${i} * ${j} = ${i * j}`);
    }
    console.log('');
  }
}

function gugudan2() {
  for (let i = 0; i < 81; i++) {
    let a = Math.floor(i / 9) + 1;
    let b = (i % 9) + 1;
    console.log(`${a} * ${b} = ${a * b}`);
  }
}

gugudan2();
