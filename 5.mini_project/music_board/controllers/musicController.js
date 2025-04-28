// 음악 관련 컨트롤러
const MusicService = require('../models/music');
const CommentService = require('../models/comments');
const LikeService = require('../models/likes');
const MusicTagService = require('../models/music_tags');

// 음악 상세 정보 조회
async function getMusicDetail(req, res) {
  try {
    const musicId = req.params.id;
    const userId = req.session.userId;

    // 음악 기본 정보 조회
    const music = await MusicService.getById(musicId);
    if (!music) {
      req.flash('error', '존재하지 않는 음악입니다.');
      return res.redirect('/');
    }

    // 관련 정보 병렬 조회
    const [comments, likeStatus, tags] = await Promise.all([
      CommentService.getByMusicId(musicId),
      LikeService.getLikeStatus(musicId, userId),
      MusicTagService.getTagsByMusicId(musicId),
    ]);

    // 음악 객체에 추가 정보 결합
    music.tags = tags.map((tag) => tag.name);
    music.liked = likeStatus.liked;
    music.likeCount = likeStatus.likeCount;

    return res.render('musicDetail', {
      music,
      comments,
      user: res.locals.user,
    });
  } catch (error) {
    console.error('음악 상세 조회 오류:', error);
    req.flash('error', '음악 정보를 불러오는 중 오류가 발생했습니다.');
    return res.redirect('/');
  }
}

module.exports = {
  getMusicDetail,
};
