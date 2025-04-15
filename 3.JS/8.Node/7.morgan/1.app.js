const express = require('express');

// 운영할 땐 morgan('combined')를 사용하고, 개발할 땐 morgan('dev')를 사용한다.
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
