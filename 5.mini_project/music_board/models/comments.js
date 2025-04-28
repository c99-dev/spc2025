// 댓글 모델
const db = require('../db/connection');

class Comment {
  // 새 댓글 작성
  static create(userId, musicId, content) {
    try {
      const stmt = db.prepare(`
        INSERT INTO comments (user_id, music_id, content) VALUES (?, ?, ?)
      `);
      const result = stmt.run(userId, musicId, content);
      return this.getById(result.lastInsertRowid); // 생성된 댓글 정보 반환
    } catch (err) {
      console.error('댓글 생성 오류:', err.message);
      throw err;
    }
  }

  // ID로 댓글 조회 (사용자명 포함)
  static getById(id) {
    try {
      const stmt = db.prepare(`
        SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `);
      return stmt.get(id);
    } catch (err) {
      console.error('댓글 조회 오류:', err.message);
      return null;
    }
  }

  // 음악 ID로 댓글 목록 조회 (사용자명 포함)
  static getByMusicId(musicId) {
    try {
      const stmt = db.prepare(`
        SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.music_id = ?
        ORDER BY c.created_at DESC
      `);
      return stmt.all(musicId);
    } catch (err) {
      console.error('음악별 댓글 조회 오류:', err.message);
      return [];
    }
  }

  // 댓글 내용 수정
  static update(id, content) {
    try {
      const stmt = db.prepare(`UPDATE comments SET content = ? WHERE id = ?`);
      stmt.run(content, id);
      return this.getById(id); // 수정된 댓글 정보 반환
    } catch (err) {
      console.error('댓글 수정 오류:', err.message);
      throw err;
    }
  }

  // 댓글 삭제
  static delete(id) {
    try {
      const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0; // 삭제 성공 여부 반환
    } catch (err) {
      console.error('댓글 삭제 오류:', err.message);
      throw err;
    }
  }

  // 최근 댓글 목록 조회 (음악 제목 포함)
  static getRecentComments(limit = 10) {
    try {
      const stmt = db.prepare(`
        SELECT c.*, u.username, m.title as music_title
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN music m ON c.music_id = m.id
        ORDER BY c.created_at DESC
        LIMIT ?
      `);
      return stmt.all(limit);
    } catch (err) {
      console.error('최근 댓글 조회 오류:', err.message);
      return [];
    }
  }

  // 사용자가 작성한 댓글 목록 조회 (음악 제목 포함)
  static getByUserId(userId) {
    try {
      const stmt = db.prepare(`
        SELECT c.id, c.content, c.created_at, c.music_id, m.title
        FROM comments c
        JOIN music m ON c.music_id = m.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `);
      return stmt.all(userId);
    } catch (err) {
      console.error('사용자별 댓글 조회 오류:', err.message);
      return [];
    }
  }
}

module.exports = Comment;
