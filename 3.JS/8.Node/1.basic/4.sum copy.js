function sum_to_num(num) {
  let sum = 0;
  for (let i = 1; i <= num; i++) {
    sum += i;
  }
  console.log(`${sum}`);
}

sum_to_num(1000000000);
