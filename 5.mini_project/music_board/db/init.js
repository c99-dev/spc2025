const db = require('./connection');
const fs = require('fs');
const path = require('path');

const executeSqlFile = (filePath) => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    db.exec(sqlContent);
    console.log(`SQL 파일 실행 성공: ${filePath}`);
  } catch (error) {
    console.error(`SQL 파일 실행 오류 (${filePath}):`, error.message);
    throw error;
  }
};

const createTables = () => {
  try {
    console.log('데이터베이스 초기화 시작...');

    const ddlPath = path.join(__dirname, 'sql', 'ddl.sql');
    executeSqlFile(ddlPath);

    const dmlPath = path.join(__dirname, 'sql', 'dml.sql');
    executeSqlFile(dmlPath);

    console.log('데이터베이스 초기화 완료!');
  } catch (error) {
    console.error('데이터베이스 초기화 실패:', error.message);
    process.exit(1);
  }
};

module.exports = {
  createTables,
};
