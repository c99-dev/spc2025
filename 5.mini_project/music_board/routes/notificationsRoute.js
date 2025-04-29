const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { isAuthenticated } = require('../middlewares/auth');

// 알림 목록 조회
router.get('/', isAuthenticated, notificationController.getNotifications);

// 알림 읽음 처리
router.post('/read/:id', isAuthenticated, notificationController.markAsRead);

// 모든 알림 읽음 처리
router.post('/read-all', isAuthenticated, notificationController.markAllAsRead);

module.exports = router;
