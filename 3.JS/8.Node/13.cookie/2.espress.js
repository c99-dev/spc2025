const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();
const post = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log(req.url, req.cookies);
  res.cookie('myCookie', '1234', { maxAge: 1000 * 10 });
  res.send('ok');
});

app.get('/readcookie', (req, res) => {
  const cookie = req.cookies;
  console.log(req.url, cookie);
  res.send('너가 가져온 cookie: ' + cookie.myCookie);
});

app.listen(post, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${post}`);
});
