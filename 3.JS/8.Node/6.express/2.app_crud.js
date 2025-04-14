const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('헬로버디');
});

app.post('/', (req, res) => {
  res.send('POST 요청 수신');
});

app.put('/', (req, res) => {
  res.send('PUT 요청 수신');
});

app.delete('/', (req, res) => {
  res.send('DELETE 요청 수신');
});

app.get('/user', (req, res) => {
  res.send('헬로 사용자');
});

app.post('/user', (req, res) => {
  res.send('사용자 생성됨');
});

app.put('/user', (req, res) => {
  res.send('사용자 정보 업데이트됨');
});

app.delete('/user', (req, res) => {
  res.send('사용자 삭제됨');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
