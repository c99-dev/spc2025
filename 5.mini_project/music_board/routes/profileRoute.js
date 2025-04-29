const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const profileController = require('../controllers/profileController');

// 프로필 페이지
router.get('/', isAuthenticated, profileController.getProfile);

module.exports = router;
