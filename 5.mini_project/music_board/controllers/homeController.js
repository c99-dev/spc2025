// 홈 화면 컨트롤러
const MusicService = require('../models/music');
const LikeService = require('../models/likes');

// 홈 화면 조회
async function getHomePage(req, res) {
  try {
    const musicList = await MusicService.searchMusic('');
    await attachLikeInformation(musicList, req.session.userId);

    return res.render('home', { musicList });
  } catch (error) {
    console.error('홈 페이지 로드 오류:', error);
    return res
      .status(500)
      .render('error', { message: '페이지 로드 중 오류가 발생했습니다.' });
  }
}

// 음악 검색
async function searchMusic(req, res) {
  try {
    const searchText = req.query.q || '';
    const musicList = await MusicService.searchMusic(searchText);

    const userId = req.session.userId || (req.user ? req.user.id : null);
    await attachLikeInformation(musicList, userId);

    return res.render('home', { musicList });
  } catch (error) {
    console.error('검색 오류:', error);
    return res
      .status(500)
      .render('error', { message: '검색 중 오류가 발생했습니다.' });
  }
}

// 음악 목록에 좋아요 정보 첨부
async function attachLikeInformation(musicList, userId) {
  if (!userId || !musicList.length) {
    return musicList;
  }

  const likePromises = musicList.map(async (music) => {
    const likeStatus = await LikeService.getLikeStatus(music.id, userId);
    music.liked = likeStatus.liked;
    return music;
  });

  return Promise.all(likePromises);
}

module.exports = {
  getHomePage,
  searchMusic,
};
