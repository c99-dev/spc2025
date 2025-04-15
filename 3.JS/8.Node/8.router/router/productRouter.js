const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
  res.send('product/list');
});

router.get('/:id/detail', (req, res) => {
  res.send('product/:id/detail');
});

module.exports = router;
