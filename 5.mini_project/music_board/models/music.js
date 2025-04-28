// 음악 모델
const db = require('../db/connection');

class Music {
  // 음악 검색 (제목, 아티스트, 태그)
  static searchMusic(searchText) {
    try {
      const query = `
        SELECT 
          m.id, m.title, m.artist, 
          GROUP_CONCAT(DISTINCT t.name) as tags,
          (SELECT COUNT(*) FROM likes WHERE music_id = m.id) as like_count
        FROM music m
        LEFT JOIN music_tags mt ON m.id = mt.music_id
        LEFT JOIN tags t ON mt.tag_id = t.id
        WHERE m.title LIKE ? OR m.artist LIKE ? OR t.name LIKE ?
        GROUP BY m.id
        ORDER BY m.id DESC
      `;
      const searchTerm = `%${searchText}%`;
      return db.prepare(query).all(searchTerm, searchTerm, searchTerm);
    } catch (err) {
      console.error('음악 검색 오류:', err.message);
      return [];
    }
  }

  // ID로 음악 정보 조회
  static getById(id) {
    try {
      const query = `SELECT m.id, m.title, m.artist FROM music m WHERE m.id = ?`;
      return db.prepare(query).get(id);
    } catch (err) {
      console.error('음악 조회 오류:', err.message);
      return null;
    }
  }

  // 전체 음악 목록 조회
  static getAllMusic() {
    try {
      const query = `
        SELECT m.id, m.title, m.artist,
               (SELECT COUNT(*) FROM likes WHERE music_id = m.id) as like_count
        FROM music m
        ORDER BY m.id DESC
      `;
      return db.prepare(query).all();
    } catch (err) {
      console.error('음악 목록 조회 오류:', err.message);
      return [];
    }
  }
}

module.exports = Music;
