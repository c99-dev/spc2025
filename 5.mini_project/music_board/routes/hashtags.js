const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController');

// 모든 해시태그 조회 페이지
router.get('/', hashtagController.getAllTags);

// 특정 태그로 음악 필터링
router.get('/:tagName', hashtagController.getMusicByTag);

// 새 태그 추가 (API)
router.post('/api/tags', hashtagController.addTag);

// 음악과 태그 연결 (API)
router.post('/api/music/:musicId/tags', hashtagController.updateMusicTags);

// 트렌드 태그 조회 (API)
router.get('/api/trending', hashtagController.getTrendingTags);

module.exports = router;
