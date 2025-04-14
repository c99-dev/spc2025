const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

const data = fs.readFileSync(filePath);
if (!data) {
  console.error('Error reading file');
  return;
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(data);
});

server.listen(() => {
  console.log(`Server running at http://localhost:${server.address().port}/`);
});
