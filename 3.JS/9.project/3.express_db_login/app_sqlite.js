const express = require('express');
const app = express();
const port = 3000;

const slqite3 = require('sqlite3').verbose();
const db = new slqite3.Database('users.db');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.route('/login').post(async (req, res) => {
  const { username, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE name = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (!row) {
        return res.status(401).send('로그인 실패');
      }
      res.send('로그인 성공');
    }
  );
});

app.listen(port, () => {
  console.log(`서버가 여기서 실행 중 http://localhost:${port}`);
});
