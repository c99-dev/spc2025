// 태그 모델
const db = require('../db/connection');

class Tag {
  // 모든 태그 조회 (음악과 연결된 태그만)
  static async getAllTags() {
    try {
      const sql = `
        SELECT t.name, COUNT(mt.music_id) as count
        FROM tags t
        LEFT JOIN music_tags mt ON t.id = mt.tag_id
        GROUP BY t.name
        HAVING count > 0
        ORDER BY count DESC
      `;
      const stmt = db.prepare(sql);
      return stmt.all() || [];
    } catch (err) {
      console.error('태그 목록 조회 오류:', err.message);
      return [];
    }
  }

  // 특정 태그 이름으로 음악 목록 조회
  static async getMusicByTag(tagName) {
    try {
      const sql = `
        SELECT m.*
        FROM music m
        JOIN music_tags mt ON m.id = mt.music_id
        JOIN tags t ON mt.tag_id = t.id
        WHERE t.name = ?
        ORDER BY m.id DESC
      `;
      const stmt = db.prepare(sql);
      return stmt.all(tagName);
    } catch (err) {
      console.error('태그별 음악 조회 오류:', err.message);
      return [];
    }
  }

  // 특정 태그와 관련된 다른 태그 조회
  static async getRelatedTags(tagName) {
    try {
      const sql = `
        SELECT t2.name, COUNT(mt2.music_id) as count
        FROM tags t
        JOIN music_tags mt ON t.id = mt.tag_id
        JOIN music m ON mt.music_id = m.id
        JOIN music_tags mt2 ON m.id = mt2.music_id
        JOIN tags t2 ON mt2.tag_id = t2.id
        WHERE t.name = ? AND t2.name != ?
        GROUP BY t2.name
        ORDER BY count DESC
        LIMIT 10
      `;
      const stmt = db.prepare(sql);
      return stmt.all(tagName, tagName);
    } catch (err) {
      console.error('연관 태그 조회 오류:', err.message);
      return [];
    }
  }

  // 새 태그 추가 (이미 존재하면 ID 반환)
  static async addTag(name) {
    try {
      // 먼저 태그 존재 여부 확인
      const findStmt = db.prepare('SELECT id FROM tags WHERE name = ?');
      const existingTag = findStmt.get(name);
      if (existingTag) return existingTag.id;

      // 없으면 새로 추가
      const insertStmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
      const result = insertStmt.run(name);
      return result.lastInsertRowid;
    } catch (err) {
      console.error('태그 추가 오류:', err.message);
      return null;
    }
  }

  // 태그 이름으로 ID 조회
  static async getTagIdByName(name) {
    try {
      const sql = `SELECT id FROM tags WHERE name = ?`;
      const stmt = db.prepare(sql);
      const row = stmt.get(name);
      return row ? row.id : null;
    } catch (err) {
      console.error('태그 ID 조회 오류:', err.message);
      return null;
    }
  }

  // 인기 태그 조회 (트렌딩)
  static async getTrendingTags(limit = 20) {
    try {
      const sql = `
        SELECT t.name, COUNT(mt.music_id) as count
        FROM tags t
        JOIN music_tags mt ON t.id = mt.tag_id
        GROUP BY t.name
        ORDER BY count DESC
        LIMIT ?
      `;
      const stmt = db.prepare(sql);
      return stmt.all(limit);
    } catch (err) {
      console.error('트렌드 태그 조회 오류:', err.message);
      return [];
    }
  }
}

module.exports = Tag;
