const express = require('express');
const router = express.Router();
const { searchMusic } = require('../models/music');

router.get('/', (req, res) => {
  const user = null;
  const musicList = searchMusic('');
  res.render('home', { user, musicList });
});

router.get('/search', (req, res) => {
  const user = null;
  const searchText = req.query.q || '';
  const musicList = searchMusic(searchText);
  res.render('home', { user, musicList });
});

module.exports = router;
