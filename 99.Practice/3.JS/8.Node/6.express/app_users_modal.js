const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// 이름, 닉네임, 나이
const users = { 0: { name: 'john', nickname: 'johnny', age: 30 } };

app.get('/', (req, res) => {
  try {
    const htmlFilePath = path.join(__dirname, 'public', 'users_modal.html');
    res.sendFile(htmlFilePath);
  } catch (error) {
    console.error('홈페이지 로드 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// curl 127.0.0.1:3000/users
app.get('/users', (req, res) => {
  try {
    res.status(200).json({ users });
  } catch (error) {
    console.error('사용자 목록 조회 중 오류 발생:', error);
    res
      .status(500)
      .json({ error: '사용자 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});

// curl 127.0.0.1:3000/users -X POST -d "{\"name\": \"john\"}" -H "Content-Type: application/json"
let userIdIndex = 1;
app.post('/users', (req, res) => {
  try {
    const { name, nickname, age } = req.body;

    const userId = userIdIndex++;
    users[userId] = { name, nickname, age };
    res.status(201).json({
      user: users[userId],
    });
    console.log(users);
  } catch (error) {
    console.error('사용자 추가 중 오류 발생:', error);
    res
      .status(500)
      .json({ error: '사용자를 추가하는 중 오류가 발생했습니다.' });
  }
});

// curl 127.0.0.1:3000/users/1 -X PUT -d "{\"name\": \"john123\"}" -H "Content-Type: application/json"
app.put('/users/:id', (req, res) => {
  try {
    const userId = req.params.id;

    if (!users[userId]) {
      return res
        .status(404)
        .json({ error: '해당 ID의 사용자를 찾을 수 없습니다.' });
    }

    const { name, nickname, age } = req.body;
    users[userId] = { name, nickname, age };
    res.status(200).send();
    console.log(users);
  } catch (error) {
    console.error('사용자 수정 중 오류 발생:', error);
    res
      .status(500)
      .json({ error: '사용자 정보를 수정하는 중 오류가 발생했습니다.' });
  }
});

// curl 127.0.0.1:3000/users/1 -X DELETE
app.delete('/users/:id', (req, res) => {
  try {
    const userId = req.params.id;

    if (!users[userId]) {
      return res
        .status(404)
        .json({ error: '해당 ID의 사용자를 찾을 수 없습니다.' });
    }

    delete users[userId];
    res.status(204).send();
    console.log(users);
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error);
    res
      .status(500)
      .json({ error: '사용자를 삭제하는 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
