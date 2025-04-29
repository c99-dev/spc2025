// 관리자 라우터
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// 모든 관리자 라우트에 인증 및 관리자 권한 검사 미들웨어 적용
router.use(isAuthenticated);
router.use(isAdmin);

// 사용자 관리 페이지
router.get('/users', adminController.listUsers);
router.post('/users/:id/delete', adminController.deleteUser);

// 댓글 관리 페이지
router.get('/comments', adminController.listComments);
router.post('/comments/:id/delete', adminController.deleteComment);

module.exports = router;
