// 데이터베이스 초기화 스크립트
const db = require('./connection');
const fs = require('fs');
const path = require('path');

// SQL 파일 실행 함수
const executeSqlFile = (filePath) => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    db.exec(sqlContent);
    console.log(`SQL 파일 실행 성공: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(
      `SQL 파일 실행 오류 (${path.basename(filePath)}):`,
      error.message
    );
    throw error; // 오류 발생 시 상위로 전파
  }
};

// 테이블 생성 및 초기 데이터 삽입 함수
const createTables = () => {
  try {
    console.log('데이터베이스 초기화 시작...');
    // DDL 실행 (테이블 구조 정의)
    executeSqlFile(path.join(__dirname, 'sql', 'ddl.sql'));
    // DML 실행 (초기 데이터 삽입)
    executeSqlFile(path.join(__dirname, 'sql', 'dml.sql'));
    console.log('데이터베이스 초기화 완료!');
  } catch (error) {
    console.error('데이터베이스 초기화 실패:', error.message);
    process.exit(1); // 초기화 실패 시 프로세스 종료
  }
};

module.exports = {
  createTables,
};
