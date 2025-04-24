// imports
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const db = require('better-sqlite3')('./db/music.db', { verbose: console.log });

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// routes
const rootRouter = require('./routes/root');

app.use('/', rootRouter);

app.listen(port, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${port}`);
});
