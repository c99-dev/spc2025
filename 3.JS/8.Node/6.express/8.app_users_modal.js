const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// 이름, 닉네임, 나이
const users = { 0: { name: 'john', nickname: 'johnny', age: 30 } };

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'public', 'users_modal.html');
  res.sendFile(htmlFilePath);
});

// curl 127.0.0.1:3000/users
app.get('/users', (req, res) => {
  res.status(200).json({ users });
});

// curl 127.0.0.1:3000/users -X POST -d "{\"name\": \"john\"}" -H "Content-Type: application/json"
let userIdIndex = 1;
app.post('/users', (req, res) => {
  const { name, nickname, age } = req.body;
  const userId = userIdIndex++;
  users[userId] = { name, nickname, age };
  res.status(201).json({
    user: users[userId],
  });
  console.log(users);
});

// curl 127.0.0.1:3000/users/1 -X PUT -d "{\"name\": \"john123\"}" -H "Content-Type: application/json"
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, nickname, age } = req.body;
  users[userId] = { name, nickname, age };
  res.status(200).send();
  console.log(users);
});

// curl 127.0.0.1:3000/users/1 -X DELETE
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  delete users[userId];
  res.status(204).send();
  console.log(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
