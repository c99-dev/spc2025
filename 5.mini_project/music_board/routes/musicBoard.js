const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  const user = null; // 예시: 로그아웃 상태
  res.render('musicBoard', { user: user });
});

module.exports = router;
