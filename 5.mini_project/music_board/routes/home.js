const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// 홈 화면 - 모든 음악 목록
router.get('/', homeController.getHomePage);

// 검색 기능
router.get('/search', homeController.searchMusic);

module.exports = router;
