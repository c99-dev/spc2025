const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/login', async (req, res) => {
  const { username, password } = req.query;
  if (username && password) {
    res.json({ message: '로그인 성공!' });
  } else {
    res.status(401).json({ message: '로그인 실패!' });
  }
});

app.listen(port, () => {
  console.log(`서버 실행 중 http://localhost:${port}`);
});
