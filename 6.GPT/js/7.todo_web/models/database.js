const Database = require('better-sqlite3');
const db = new Database('todos.db');

// 테이블 생성
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`
).run();

module.exports = db;
