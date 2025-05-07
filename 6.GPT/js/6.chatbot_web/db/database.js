const db = require('better-sqlite3')('./db/chatgpt.db');

// DB 초기화 함수
function resetDatabase() {
  db.exec(`
    DROP TABLE IF EXISTS chat_history;
    DROP TABLE IF EXISTS session;

    CREATE TABLE session(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      session_id INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE
    );
  `);
}

// 채팅 기록 저장 함수
function insertChatHistory(role, content, sessionId) {
  const stmt = db.prepare(
    'INSERT INTO chat_history (role, content, session_id) VALUES (?, ?, ?)'
  );
  stmt.run(role, content, sessionId);
  console.log(`대화 기록 삽입됨: ${role} - ${content}`);
  console.log(`세션 ID: ${sessionId}`);
}

// 채팅 기록 조회 함수
function getChatHistory(sessionId) {
  const stmt = db.prepare(
    `SELECT role, content FROM chat_history WHERE session_id = ? ORDER BY id DESC`
  );
  const rows = stmt.all(sessionId);
  return rows.reverse();
}

// 세션 목록 조회
function getSessions() {
  const stmt = db.prepare('SELECT id, created_at FROM session');
  return stmt.all();
}

// 새 세션 생성
function createSession() {
  const result = db.prepare('INSERT INTO session (id) VALUES (NULL)').run();
  return getSession(result.lastInsertRowid);
}

// 세션 가져오기
function getSession(sessionId) {
  return db
    .prepare('SELECT id, created_at FROM session WHERE id = ?')
    .get(sessionId);
}

// 초기화 실행
resetDatabase();

// 모듈 내보내기
module.exports = {
  resetDatabase,
  insertChatHistory,
  getChatHistory,
  getSessions,
  createSession,
  getSession,
};
