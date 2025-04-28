const express = require('express');
const router = express.Router();
const topLikesController = require('../controllers/topLikesController');

// 인기 음악 페이지
router.get('/', topLikesController.getTopLikedMusic);

module.exports = router;
