const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isLoggedInApi } = require('../middlewares/auth');

// 좋아요 토글 API
router.post('/music/:musicId/like', isLoggedInApi, apiController.toggleLike);

// 좋아요 상태 조회 API
router.get('/music/:musicId/like', apiController.getLikeStatus);

// 댓글 작성 API
router.post(
  '/music/:musicId/comments',
  isLoggedInApi,
  apiController.createComment
);

// 댓글 목록 조회 API
router.get('/music/:musicId/comments', apiController.getComments);

// 댓글 수정 API
router.put('/comments/:commentId', isLoggedInApi, apiController.updateComment);

// 댓글 삭제 API
router.delete(
  '/comments/:commentId',
  isLoggedInApi,
  apiController.deleteComment
);

module.exports = router;
