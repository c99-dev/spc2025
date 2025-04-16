const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'ejs 배우기', heading: 'ejs 배워어' });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
