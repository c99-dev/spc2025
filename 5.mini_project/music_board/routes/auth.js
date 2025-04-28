const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET 로그인 페이지
router.get('/login', authController.showLoginPage);

// POST 로그인 처리
router.post('/login', authController.processLogin);

// GET 회원가입 페이지
router.get('/register', authController.showRegisterPage);

// POST 회원가입 처리
router.post('/register', authController.processRegister);

// 로그아웃
router.get('/logout', authController.processLogout);

module.exports = router;
