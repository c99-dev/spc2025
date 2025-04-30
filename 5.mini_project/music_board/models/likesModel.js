// 좋아요 모델
const db = require('../db/connection');

class Like {
  // 음악 ID로 좋아요 정보 조회 (사용자명 포함)
  static getByMusicId(musicId) {
    try {
      const stmt = db.prepare(`
        SELECT l.*, u.username 
        FROM likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.music_id = ?
      `);
      return stmt.all(musicId);
    } catch (err) {
      console.error('음악 좋아요 조회 오류:', err.message);
      return [];
    }
  }

  // 좋아요 토글 (추가 또는 삭제)
  static toggle(musicId, userId) {
    const checkStmt = db.prepare(
      'SELECT id FROM likes WHERE user_id = ? AND music_id = ?'
    );
    const existingLike = checkStmt.get(userId, musicId);

    try {
      if (existingLike) {
        // 좋아요 취소
        const deleteStmt = db.prepare('DELETE FROM likes WHERE id = ?');
        deleteStmt.run(existingLike.id);
        return { liked: false };
      } else {
        // 좋아요 추가
        const insertStmt = db.prepare(
          'INSERT INTO likes (user_id, music_id) VALUES (?, ?)'
        );
        insertStmt.run(userId, musicId);
        return { liked: true };
      }
    } catch (err) {
      console.error('좋아요 토글 오류:', err.message);
      throw err;
    }
  }

  // 음악의 좋아요 상태 및 개수 조회
  static getLikeStatus(musicId, userId) {
    try {
      // 좋아요 개수
      const countStmt = db.prepare(
        'SELECT COUNT(*) as count FROM likes WHERE music_id = ?'
      );
      const { count } = countStmt.get(musicId);

      // 사용자의 좋아요 여부 (로그인 시)
      let liked = false;
      if (userId) {
        const stmt = db.prepare(
          'SELECT 1 FROM likes WHERE user_id = ? AND music_id = ?'
        );
        liked = !!stmt.get(userId, musicId);
      }

      return { liked, likeCount: count };
    } catch (err) {
      console.error('좋아요 상태 조회 오류:', err.message);
      return { liked: false, likeCount: 0 };
    }
  }

  // 좋아요 많은 음악 조회 (Top N)
  static getTopLikedMusic(limit = 10) {
    try {
      const stmt = db.prepare(`
        SELECT m.*, COUNT(l.id) as like_count, 
               GROUP_CONCAT(u.username) as liked_by_users
        FROM music m
        JOIN likes l ON m.id = l.music_id
        JOIN users u ON l.user_id = u.id
        GROUP BY m.id
        ORDER BY like_count DESC
        LIMIT ?
      `);
      const musics = stmt.all(limit);
      // liked_by_users 문자열을 배열로 변환
      return musics.map((music) => ({
        ...music,
        likedBy: music.liked_by_users ? music.liked_by_users.split(',') : [],
      }));
    } catch (err) {
      console.error('인기 음악 조회 오류:', err.message);
      return [];
    }
  }

  // 사용자가 좋아요한 음악 목록 조회
  static getLikedMusicByUserId(userId) {
    try {
      const stmt = db.prepare(`
        SELECT m.id, m.title, m.artist, 
               (SELECT COUNT(*) FROM likes WHERE music_id = m.id) as like_count
        FROM music m
        JOIN likes l ON m.id = l.music_id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
      `);
      return stmt.all(userId);
    } catch (err) {
      console.error('사용자별 좋아요 음악 조회 오류:', err.message);
      return [];
    }
  }
}

module.exports = Like;
