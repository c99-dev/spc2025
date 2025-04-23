const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.headers.cookie);
  res.writeHead(200, { 'set-cookie': 'myCookie=test' });
  res.end('ok');
});

server.listen(3000, () => {
  console.log('서버 여기서 실행 중 http://localhost:3000');
});
