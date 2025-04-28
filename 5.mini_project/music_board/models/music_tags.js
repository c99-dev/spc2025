// 음악-태그 연결 모델
const db = require('../db/connection');

class MusicTag {
  // 음악에 태그 추가
  static async addTagToMusic(musicId, tagId) {
    try {
      const sql = `INSERT INTO music_tags (music_id, tag_id) VALUES (?, ?) ON CONFLICT(music_id, tag_id) DO NOTHING`;
      const stmt = db.prepare(sql);
      const info = stmt.run(musicId, tagId);
      return { changes: info.changes };
    } catch (err) {
      console.error('음악에 태그 추가 오류:', err.message);
      throw err;
    }
  }

  // 음악에서 태그 제거
  static async removeTagFromMusic(musicId, tagId) {
    try {
      const sql = `DELETE FROM music_tags WHERE music_id = ? AND tag_id = ?`;
      const stmt = db.prepare(sql);
      const info = stmt.run(musicId, tagId);
      return { changes: info.changes };
    } catch (err) {
      console.error('음악에서 태그 제거 오류:', err.message);
      throw err;
    }
  }

  // 특정 음악의 태그 목록 조회
  static async getTagsByMusicId(musicId) {
    try {
      const sql = `
        SELECT t.id, t.name
        FROM tags t
        JOIN music_tags mt ON t.id = mt.tag_id
        WHERE mt.music_id = ?
      `;
      const stmt = db.prepare(sql);
      return stmt.all(musicId);
    } catch (err) {
      console.error('음악의 태그 조회 오류:', err.message);
      return [];
    }
  }

  // 특정 태그 ID로 음악 목록 조회
  static async getMusicByTagId(tagId) {
    try {
      const sql = `
        SELECT m.*
        FROM music m
        JOIN music_tags mt ON m.id = mt.music_id
        WHERE mt.tag_id = ?
      `;
      const stmt = db.prepare(sql);
      return stmt.all(tagId);
    } catch (err) {
      console.error('태그별 음악 조회 오류:', err.message);
      return [];
    }
  }

  // 음악의 태그 목록 업데이트 (기존 연결 모두 삭제 후 새로 추가)
  static async updateMusicTags(musicId, tagIds) {
    const transaction = db.transaction(() => {
      try {
        // 기존 태그 연결 삭제
        const deleteStmt = db.prepare(
          'DELETE FROM music_tags WHERE music_id = ?'
        );
        deleteStmt.run(musicId);

        // 새 태그 연결 추가
        if (tagIds && tagIds.length > 0) {
          const insertStmt = db.prepare(
            'INSERT INTO music_tags (music_id, tag_id) VALUES (?, ?)'
          );
          for (const tagId of tagIds) {
            // tagId 유효성 검사 추가 가능
            insertStmt.run(musicId, tagId);
          }
        }
        return { musicId, tagCount: tagIds ? tagIds.length : 0 };
      } catch (err) {
        console.error('음악 태그 업데이트 트랜잭션 오류:', err.message);
        throw err; // 오류 발생 시 롤백
      }
    });

    try {
      return transaction();
    } catch (err) {
      // 트랜잭션 외부에서 오류 처리
      console.error('음악 태그 업데이트 오류:', err.message);
      throw err;
    }
  }
}

module.exports = MusicTag;
