// 프로필 관련 컨트롤러
const CommentService = require('../models/comments');
const LikeService = require('../models/likes');

// 프로필 정보 조회
async function getProfile(req, res) {
  try {
    const userId = req.session.userId;

    // 병렬로 사용자 댓글과 좋아요한 음악 조회
    const [userComments, likedMusic] = await Promise.all([
      CommentService.getByUserId(userId),
      LikeService.getLikedMusicByUserId(userId),
    ]);

    return res.render('profile', {
      title: '프로필',
      path: '/profile',
      user: res.locals.user,
      comments: userComments,
      likedMusic,
    });
  } catch (error) {
    return handleProfileError(req, res, error);
  }
}

// 프로필 오류 처리
function handleProfileError(req, res, error) {
  console.error('프로필 데이터 조회 오류:', error);
  req.flash('error', '프로필 정보를 불러오는 중 오류가 발생했습니다.');
  return res.redirect('/');
}

module.exports = {
  getProfile,
};
