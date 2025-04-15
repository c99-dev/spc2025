const express = require('express');

const app = express();
const port = 3000;

const users = {};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/user', (req, res) => {
  res.json(users);
});

// curl 127.0.0.1:3000/user -X POST  -d "{\"name\": \"john\"}" -H "Content-Type: application/json"
app.post('/user', (req, res) => {
  const userId = Object.keys(users).length + 1;
  users[userId] = req.body;
  console.log(users);
  res.send('User created!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
