const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'music.db');
const db = new Database(dbPath);

// 외래키 제약조건 활성화
db.pragma('foreign_keys = ON');

module.exports = db;
