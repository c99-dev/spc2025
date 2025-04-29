// API 관련 컨트롤러
const LikeService = require('../models/likesModel');
const CommentService = require('../models/commentsModel');
const NotificationService = require('../models/notificationsModel');

// 좋아요 토글 API
async function toggleLike(req, res) {
  try {
    const { musicId } = req.params;
    const userId = req.session.userId;

    const result = await LikeService.toggle(musicId, userId);
    const likeStatus = await LikeService.getLikeStatus(musicId, userId);

    return res.json({
      liked: result.liked,
      likeCount: likeStatus.likeCount,
    });
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    return res
      .status(500)
      .json({ error: '좋아요 처리 중 오류가 발생했습니다.' });
  }
}

// 좋아요 상태 조회 API
async function getLikeStatus(req, res) {
  try {
    const { musicId } = req.params;
    const userId = req.session.userId;

    const likeStatus = await LikeService.getLikeStatus(musicId, userId);
    return res.json(likeStatus);
  } catch (error) {
    console.error('좋아요 상태 조회 오류:', error);
    return res
      .status(500)
      .json({ error: '좋아요 상태 조회 중 오류가 발생했습니다.' });
  }
}

// 댓글 작성 API
async function createComment(req, res) {
  try {
    const { musicId } = req.params;
    const { content } = req.body;
    const userId = req.session.userId;

    // 입력값 검증
    if (!validateCommentContent(content)) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    }

    const comment = await CommentService.create(
      userId,
      musicId,
      content.trim()
    );

    // 알림 생성 처리
    await createCommentNotification(comment.id);

    return res.status(201).json({ comment });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
  }
}

// 댓글 목록 조회 API
async function getComments(req, res) {
  try {
    const { musicId } = req.params;
    const comments = await CommentService.getByMusicId(musicId);
    return res.json({ comments });
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    return res
      .status(500)
      .json({ error: '댓글 목록 조회 중 오류가 발생했습니다.' });
  }
}

// 댓글 수정 API
async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.session.userId;

    // 댓글 존재 및 소유권 확인
    const comment = await CommentService.getById(commentId);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
    if (!isCommentOwner(comment, userId)) {
      return res
        .status(403)
        .json({ error: '본인의 댓글만 수정할 수 있습니다.' });
    }

    // 입력값 검증
    if (!validateCommentContent(content)) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    }

    const updatedComment = await CommentService.update(
      commentId,
      content.trim()
    );
    return res.json({ comment: updatedComment });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    return res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' });
  }
}

// 댓글 삭제 API
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.session.userId;

    // 댓글 존재 및 소유권 확인
    const comment = await CommentService.getById(commentId);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
    if (!isCommentOwner(comment, userId)) {
      return res
        .status(403)
        .json({ error: '본인의 댓글만 삭제할 수 있습니다.' });
    }

    await CommentService.delete(commentId);
    return res.json({ success: true });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return res.status(500).json({ error: '댓글 삭제 중 오류가 발생했습니다.' });
  }
}

// ========== 헬퍼 함수 ==========

// 댓글 내용 유효성 검사
function validateCommentContent(content) {
  return content && content.trim().length > 0;
}

// 댓글 소유자 확인
function isCommentOwner(comment, userId) {
  return comment.user_id === userId;
}

// 댓글 알림 생성
async function createCommentNotification(commentId) {
  try {
    await NotificationService.createCommentNotification(commentId);
  } catch (error) {
    console.error('댓글 알림 생성 오류:', error); // 알림 실패는 로깅만
  }
}

module.exports = {
  toggleLike,
  getLikeStatus,
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
