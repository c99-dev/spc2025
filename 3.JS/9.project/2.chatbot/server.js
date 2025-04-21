const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', (req, res) => {
  try {
    const question = req.body.question;
    res.json({ answer: 'Echo: ' + question });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res
      .status(500)
      .json({ answer: '서버에서 알 수 없는 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
