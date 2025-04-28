// 알림 모델
const db = require('../db/connection');

class Notification {
  // 알림 생성
  static async create(userId, musicId, commentId, message) {
    try {
      const stmt = db.prepare(`
        INSERT INTO notifications (user_id, music_id, comment_id, message)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(userId, musicId, commentId, message);
      return { id: result.lastInsertRowid };
    } catch (err) {
      console.error('알림 생성 오류:', err.message);
      throw err;
    }
  }

  // 사용자 ID로 알림 목록 조회
  static async getByUserId(userId) {
    try {
      const stmt = db.prepare(`
        SELECT n.*, m.title as music_title, u.username as commenter_username
        FROM notifications n
        LEFT JOIN music m ON n.music_id = m.id
        LEFT JOIN comments c ON n.comment_id = c.id
        LEFT JOIN users u ON c.user_id = u.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
      `);
      return stmt.all(userId);
    } catch (err) {
      console.error('사용자별 알림 조회 오류:', err.message);
      return [];
    }
  }

  // 읽지 않은 알림 개수 조회
  static async getUnreadCountByUserId(userId) {
    try {
      const stmt = db.prepare(`
        SELECT COUNT(*) as unread_count
        FROM notifications
        WHERE user_id = ? AND is_read = 0
      `);
      const result = stmt.get(userId);
      return result ? result.unread_count : 0;
    } catch (err) {
      console.error('읽지 않은 알림 개수 조회 오류:', err.message);
      return 0;
    }
  }

  // 특정 알림 읽음 처리
  static async markAsRead(notificationId) {
    try {
      const stmt = db.prepare(`
        UPDATE notifications SET is_read = 1 WHERE id = ?
      `);
      const result = stmt.run(notificationId);
      return result.changes > 0;
    } catch (err) {
      console.error('알림 읽음 처리 오류:', err.message);
      throw err;
    }
  }

  // 사용자의 모든 알림 읽음 처리
  static async markAllAsRead(userId) {
    try {
      const stmt = db.prepare(`
        UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0
      `);
      const result = stmt.run(userId);
      return result.changes;
    } catch (err) {
      console.error('모든 알림 읽음 처리 오류:', err.message);
      throw err;
    }
  }

  // 댓글 작성 시 관련 사용자에게 알림 생성
  static async createCommentNotification(commentId) {
    try {
      // 댓글 정보 조회
      const commentQuery = db.prepare(`
        SELECT c.user_id, c.music_id, c.content, u.username, m.title as music_title
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN music m ON c.music_id = m.id
        WHERE c.id = ?
      `);
      const comment = commentQuery.get(commentId);
      if (!comment) throw new Error('댓글 정보를 찾을 수 없습니다.');

      // 해당 음악에 좋아요 누른 사용자 목록 조회 (댓글 작성자 제외)
      const likedUsersQuery = db.prepare(`
        SELECT DISTINCT user_id FROM likes WHERE music_id = ? AND user_id != ?
      `);
      const likedUsers = likedUsersQuery.all(comment.music_id, comment.user_id);

      // 알림 메시지 생성
      const message = `${comment.username}님이 회원님이 좋아하는 "${
        comment.music_title
      }" 음악에 댓글을 남겼습니다: "${comment.content.substring(0, 30)}${
        comment.content.length > 30 ? '...' : ''
      }"`;

      // 각 사용자에게 알림 생성 (트랜잭션 사용)
      const insertNotification = db.prepare(`
        INSERT INTO notifications (user_id, music_id, comment_id, message) VALUES (?, ?, ?, ?)
      `);
      const transaction = db.transaction((users) => {
        let count = 0;
        for (const user of users) {
          insertNotification.run(
            user.user_id,
            comment.music_id,
            commentId,
            message
          );
          count++;
        }
        return count;
      });

      return transaction(likedUsers);
    } catch (err) {
      console.error('댓글 알림 생성 오류:', err.message);
      // 알림 생성 실패는 댓글 작성 흐름에 영향을 주지 않도록 오류를 다시 던지지 않음
    }
  }
}

module.exports = Notification;
