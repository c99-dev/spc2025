const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const users = {};

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'public', 'users.html');
  res.sendFile(htmlFilePath);
});

// curl 127.0.0.1:3000/users
app.get('/users', (req, res) => {
  res.json({ message: 'Fetch Users loaded!', users });
});

// curl 127.0.0.1:3000/users -X POST -d "{\"name\": \"john\"}" -H "Content-Type: application/json"
let userIdIndex = 1;
app.post('/users', (req, res) => {
  const userId = userIdIndex++;
  users[userId] = req.body;
  res.json({ message: `User created!`, userId });
  console.log(users);
});

// curl 127.0.0.1:3000/users/1 -X PUT -d "{\"name\": \"john123\"}" -H "Content-Type: application/json"
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const oldName = users[userId].name;
  const newName = req.body.name;
  users[userId] = req.body;
  res.json({
    message: `User updated! ${oldName} to ${newName}`,
    user: users[userId],
  });
  console.log(users);
});

// curl 127.0.0.1:3000/users/1 -X DELETE
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const name = users[userId].name;
  delete users[userId];
  res.json({ message: `User deleted! ${userId} ${name}` });
  console.log(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
