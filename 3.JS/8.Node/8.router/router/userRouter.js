const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.send('user/profile');
});

router.get('/setting', (req, res) => {
  res.send('user/setting');
});

router.get('/detail', (req, res) => {
  res.send('user/detail');
});

module.exports = router;
