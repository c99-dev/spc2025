// imports
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const { createTables } = require('./db/init');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// db 초기화
createTables();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(expressLayouts);

// routes
const musicBoard = require('./routes/musicBoard');
app.use('/', musicBoard);

app.listen(port, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${port}`);
});
