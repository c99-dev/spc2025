const stringNumber = '42';
console.log(stringNumber + 2);

const number = Number(stringNumber);
console.log(number + 2);

console.log(typeof stringNumber);
console.log(typeof number);

setTimeout(() => {
  console.log('1초 후에 출력됨');
}, 1000);

console.log('끝');

setTimeout(() => {
  console.log('3초 후에 출력됨');
}, 3000);

console.log('ㄹㅇ끝');
