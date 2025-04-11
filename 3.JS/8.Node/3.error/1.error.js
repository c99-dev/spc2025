try {
  const result = somVaribleName * 2;
} catch (error) {
  console.error('오류가 발생: ', error.message);
}

console.log('계속 진행중...');

try {
  const result = someVariableName * 2;
} catch (error) {
  if (error instanceof ReferenceError) {
    console.error('참조 오류가 발생: ', error.message);
  }
}

try {
  eval("alert('Hello World)");
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('문법 오류가 발생: ', error.message);
  }
}

try {
  let arr = new Array(-1);
} catch (error) {
  if (error instanceof RangeError) {
    console.error('범위 오류가 발생: ', error.message);
  }
}

function dvide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('숫자만 입력 가능합니다.');
  }
  if (b === 0) {
    throw new Error('0으로 나눌 수 없습니다.');
  }
  return a / b;
}

try {
  const result = dvide('a', 0);
  console.log(result);
} catch (error) {
  console.error('오류가 발생: ', error.message);
}
