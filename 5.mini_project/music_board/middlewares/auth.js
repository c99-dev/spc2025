// 인증 관련 미들웨어
const User = require('../models/usersModel');

const authMiddleware = {
  // 웹 페이지 접근 시 로그인 확인
  isAuthenticated: (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      req.flash('error', '로그인이 필요한 기능입니다.');
      res.redirect('/auth/login');
    }
  },

  // API 요청 시 로그인 확인
  isLoggedInApi: (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      // API 요청 실패 시 JSON 응답
      res.status(401).json({
        error: '로그인이 필요합니다',
        redirectTo: '/auth/login', // 클라이언트에서 리디렉션 처리하도록 유도
      });
    }
  },

  // 관리자 권한 확인
  isAdmin: async (req, res, next) => {
    if (req.session.userId) {
      try {
        const user = User.findById(req.session.userId);

        if (user && user.is_admin) {
          next();
        } else {
          req.flash('error', '관리자 권한이 필요한 기능입니다.');
          res.redirect('/');
        }
      } catch (err) {
        console.error('관리자 권한 확인 오류:', err.message);
        req.flash('error', '서버 오류가 발생했습니다.');
        res.redirect('/');
      }
    } else {
      req.flash('error', '로그인이 필요한 기능입니다.');
      res.redirect('/auth/login');
    }
  },
};

module.exports = authMiddleware;
