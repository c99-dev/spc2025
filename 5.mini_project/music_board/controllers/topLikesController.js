// 인기 음악 관련 컨트롤러
const LikeService = require('../models/likesModel');

// 인기 음악 조회 (좋아요 많은 순)
async function getTopLikedMusic(req, res) {
  try {
    const limit = 10; // 기본 조회 개수
    const topLikes = await LikeService.getTopLikedMusic(limit);

    return res.render('topLikes', { topLikes });
  } catch (error) {
    return handleError(res, error);
  }
}

// 오류 처리
function handleError(res, error) {
  console.error('인기 음악 조회 오류:', error);
  return res.status(500).send('서버 오류가 발생했습니다.');
}

module.exports = {
  getTopLikedMusic,
};
