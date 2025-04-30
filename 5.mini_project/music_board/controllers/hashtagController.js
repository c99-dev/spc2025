// 해시태그 관련 컨트롤러
const TagService = require('../models/tagsModel');
const MusicTagService = require('../models/musicTagsModel');
const LikeService = require('../models/likesModel');

// 모든 해시태그 조회
async function getAllTags(req, res) {
  try {
    const tagList = await TagService.getAllTags();
    const maxCount = calculateMaxTagCount(tagList);

    return res.render('hashtags', {
      tagList,
      maxCount,
    });
  } catch (error) {
    console.error('해시태그 조회 오류:', error);
    return res.status(500).send('서버 오류가 발생했습니다.');
  }
}

// 특정 태그로 음악 필터링
async function getMusicByTag(req, res) {
  try {
    const { tagName } = req.params;
    const userId = req.session.userId;

    // 병렬 데이터 조회
    const [musicList, relatedTags] = await Promise.all([
      TagService.getMusicByTag(tagName),
      TagService.getRelatedTags(tagName),
    ]);

    // 음악 목록에 상세 정보 첨부
    await attachDetailInfoToMusicList(musicList, userId);

    return res.render('taggedMusic', {
      tagName,
      musicList,
      relatedTags,
    });
  } catch (error) {
    console.error('태그별 음악 조회 오류:', error);
    return res.status(500).send('서버 오류가 발생했습니다.');
  }
}

// 새 태그 추가
async function addTag(req, res) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: '유효한 태그 이름이 필요합니다.' });
    }

    const cleanTagName = sanitizeTagName(name);

    if (cleanTagName.length === 0) {
      return res
        .status(400)
        .json({ error: '유효한 문자가 포함된 태그 이름이 필요합니다.' });
    }

    const tagId = await TagService.addTag(cleanTagName);
    return res.status(201).json({ id: tagId, name: cleanTagName });
  } catch (error) {
    console.error('태그 추가 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

// 음악과 태그 연결
async function updateMusicTags(req, res) {
  try {
    const { musicId } = req.params;
    const { tagIds } = req.body;

    if (!Array.isArray(tagIds)) {
      return res.status(400).json({ error: '태그 ID 배열이 필요합니다.' });
    }

    const result = await MusicTagService.updateMusicTags(musicId, tagIds);
    return res.status(200).json(result);
  } catch (error) {
    console.error('음악-태그 연결 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

// 트렌드 태그 조회
async function getTrendingTags(req, res) {
  try {
    const { limit } = req.query;
    const parsedLimit = parseInt(limit) || 20;

    const trendingTags = await TagService.getTrendingTags(parsedLimit);
    return res.json(trendingTags);
  } catch (error) {
    console.error('트렌드 태그 조회 오류:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

// ========== 헬퍼 함수 ==========

// 태그 클라우드 최대 카운트 계산
function calculateMaxTagCount(tagList) {
  return tagList.length > 0 ? Math.max(...tagList.map((tag) => tag.count)) : 1;
}

// 태그 이름 정제
function sanitizeTagName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
}

// 음악 목록에 상세 정보 첨부
async function attachDetailInfoToMusicList(musicList, userId) {
  const promises = musicList.map(async (music) => {
    // 태그 정보 추가
    const tags = await MusicTagService.getTagsByMusicId(music.id);
    music.tags = tags.map((tag) => tag.name);

    try {
      // 좋아요 정보 추가
      const likes = await LikeService.getByMusicId(music.id);
      music.likes = likes.length;
      music.likedBy = likes.map((like) => like.username);

      // 현재 사용자의 좋아요 여부
      if (userId) {
        const likeStatus = await LikeService.getLikeStatus(music.id, userId);
        music.liked = likeStatus.liked;
      } else {
        music.liked = false;
      }
    } catch (err) {
      music.likes = 0;
      music.likedBy = [];
      music.liked = false;
    }

    return music;
  });

  return Promise.all(promises);
}

module.exports = {
  getAllTags,
  getMusicByTag,
  addTag,
  updateMusicTags,
  getTrendingTags,
};
