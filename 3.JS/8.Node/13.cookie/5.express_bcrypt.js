const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const path = require('path');

const db = require('better-sqlite3')('users.db');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'asdf', resave: false, saveUninitialized: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('로그인 필요!');
  }
  const { username, password } = req.session.user;
  res.send(`아이디 : ${username}, 비밀번호 : ${password}`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userQuery = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = userQuery.get(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { username, password };
    res.json({ message: '로그인 성공!' });
  } else {
    res.status(401).json({ message: '로그인 실패!' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('로그아웃 성공!');
  });
});

app.listen(port, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${port}`);
});
