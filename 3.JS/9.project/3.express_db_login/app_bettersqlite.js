const express = require('express');
const app = express();
const port = 3000;

const db = require('better-sqlite3')('users.db');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.route('/login').post((req, res) => {
  const { username, password } = req.body;
  const userQuery = db.prepare(
    'SELECT * FROM users WHERE name = ? AND password = ?'
  );
  const user = userQuery.get(username, password);
  if (!user) {
    return res.status(401).send('로그인 실패');
  }
  res.send('로그인 성공');
});

app.listen(port, () => {
  console.log(`서버가 여기서 실행 중 http://localhost:${port}`);
});
