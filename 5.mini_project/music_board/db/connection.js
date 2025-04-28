// 데이터베이스 연결 모듈
const Database = require('better-sqlite3');
const path = require('path');

// 데이터베이스 파일 경로 설정
const dbPath = path.join(__dirname, 'music.db');

// 데이터베이스 연결 객체 생성 및 설정
const db = new Database(dbPath, {
  // 개발 환경에서만 쿼리 로깅
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// 성능 및 안정성 위한 PRAGMA 설정
db.pragma('foreign_keys = ON'); // 외래키 제약조건 활성화

module.exports = db;
