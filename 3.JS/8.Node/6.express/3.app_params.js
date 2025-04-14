const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('헬로버디');
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  res.send(`헬로 사용자 ${id}`);
});

app.get('/user/:id/profile', (req, res) => {
  const id = req.params.id;
  res.send(`프로파일 ${id}`);
});

app.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  const category = req.query.category;
  res.send(`키워드: ${keyword}, 카테고리: ${category}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
