const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const path = require('path');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.text());

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-json', (req, res) => {
  const jsonData = req.body;
  console.log('Received JSON data:', jsonData);
  res.status(201).json({ jsonData });
});

app.post('/submit-form', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);
  res.status(201).send(formData);
});

app.post('/submit-text', (req, res) => {
  const textData = req.body;
  console.log('Received text data:', textData);
  res.status(201).send(textData);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
