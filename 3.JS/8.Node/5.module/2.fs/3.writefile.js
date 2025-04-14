const fs = require('fs');

const data = 'Hello, world!';
fs.writeFile('example.txt', data, (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});
