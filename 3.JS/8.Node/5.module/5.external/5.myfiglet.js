// 아스키 아트를 내가 직접 만든다면 어떻게 해야될까?
// figlet 라이브러리를 사용하지 않고 직접 아스키 아트를 만들어보자
const asciiArt = {
  H: [
    ' _   _ ',
    '| | | |',
    '| |_| |',
    '|  _  |',
    '|_| |_|',
  ],
  E: [
    '  _____  ',
    ' | ____| ',
    ' |  _|   ',
    ' | |___  ',
    ' |_____| ',
  ],
  L: [
    ' _    ',
    '| |   ',
    '| |   ',
    '| |__ ',
    '|____|',
  ],
  O: [
    '  ___  ',
    ' / _ \\ ',
    '| | | |',
    '| |_| |',
    ' \\___/ ',
  ],
}
function printAsciiArt(text) {
  const lines = Array.from({ length: 5 }, () => '');
  for (const char of text.toUpperCase()) { 
    const art = asciiArt[char]; 
    if (art) { 
      art.forEach((line, index) => {
        lines[index] += line + ' '; 
      });
    }
  }
  console.log(lines.join('\n')); 
}
printAsciiArt('Hello');