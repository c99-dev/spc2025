const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// 음악 상세 페이지
router.get('/:id', musicController.getMusicDetail);

module.exports = router;
