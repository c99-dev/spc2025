const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(htmlFilePath);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
