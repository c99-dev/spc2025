// 사용자 모델
const db = require('../db/connection');

class User {
  // 사용자명으로 사용자 조회
  static findByUsername(username) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
      return stmt.get(username);
    } catch (err) {
      console.error('사용자 조회 오류:', err.message);
      return null;
    }
  }

  // 새 사용자 생성
  static create(username, password, name) {
    try {
      const stmt = db.prepare(
        'INSERT INTO users (username, password, name) VALUES (?, ?, ?)'
      );
      const info = stmt.run(username, password, name);
      return { id: info.lastInsertRowid };
    } catch (err) {
      console.error('사용자 생성 오류:', err.message);
      throw err;
    }
  }

  // 사용자 인증
  static authenticate(username, password) {
    try {
      const user = this.findByUsername(username);
      if (!user) return null;

      // 비밀번호 비교 (실제 앱에서는 해시 비교 필요)
      if (password === user.password) {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          is_admin: user.is_admin,
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error('인증 오류:', err.message);
      return null;
    }
  }

  // ID로 사용자 조회
  static findById(id) {
    try {
      const stmt = db.prepare(
        'SELECT id, username, name, is_admin FROM users WHERE id = ?'
      );
      return stmt.get(id);
    } catch (err) {
      console.error('사용자 ID 조회 오류:', err.message);
      return null;
    }
  }

  // 모든 사용자 목록 조회 (관리자용)
  static getAllUsers() {
    try {
      const stmt = db.prepare(`
        SELECT id, username, name, is_admin 
        FROM users
        ORDER BY id DESC
      `);
      return stmt.all();
    } catch (err) {
      console.error('사용자 목록 조회 오류:', err.message);
      return [];
    }
  }

  // 사용자 삭제 (관리자용)
  static deleteUser(id) {
    try {
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0; // 삭제 성공 여부 반환
    } catch (err) {
      console.error('사용자 삭제 오류:', err.message);
      throw err;
    }
  }
}

module.exports = User;
