const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const path = require('path');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const data = Array.from({ length: 185 }, (_, i) => `Item ${i + 1}`);

app.get('/items', (req, res) => {
  const { start, end } = req.query;
  const startItemIndex = parseInt(start, 10) || 0;
  const endItemIndex = parseInt(end, 10) || startItemIndex + 20;
  res.json(data.slice(startItemIndex, endItemIndex));
});

app.get('/items/count', (req, res) => {
  res.json({ count: data.length });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
