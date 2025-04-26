const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const user = null;
  res.render('topLikes', { user });
});

module.exports = router;
