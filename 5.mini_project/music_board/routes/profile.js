const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/auth');
const profileController = require('../controllers/profileController');

// 프로필 페이지
router.get('/', isLoggedIn, profileController.getProfile);

module.exports = router;
