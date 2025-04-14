const fs = require('fs');
const data = 'Hello, world! Synchronous!\n';
fs.writeFileSync('example.txt', data, { encoding: 'utf8', flag: 'a' });
