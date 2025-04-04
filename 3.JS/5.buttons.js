function increse() {
  console.log('증가');
  const result = document.getElementById('result');
  result.innerText = parseInt(result.innerText) + 1;
}
function decrese() {
  console.log('감소');
  const result = document.getElementById('result');
  result.innerText = parseInt(result.innerText) - 1;

  // 0 이하로 내려가면 0으로 고정
  if (parseInt(result.innerText) < 0) {
    result.innerText = 0;
  }
}
