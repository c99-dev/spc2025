const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  res.statusCode = 200;
  res.end('Hello World\n');
});

server.on('connection', (socket) => {
  console.log('New connection established!');
});

server.on('close', () => {
  console.log('Server closed!');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
