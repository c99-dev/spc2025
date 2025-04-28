const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { isLoggedIn } = require('../middlewares/auth');

// 알림 목록 조회
router.get('/', isLoggedIn, notificationController.getNotifications);

// 알림 읽음 처리
router.post('/read/:id', isLoggedIn, notificationController.markAsRead);

// 모든 알림 읽음 처리
router.post('/read-all', isLoggedIn, notificationController.markAllAsRead);

module.exports = router;
