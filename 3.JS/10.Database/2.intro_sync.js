const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

db.run('CREATE TABLE IF NOT EXISTS messages (text TEXT)', (err) => {
  console.log('테이블 생성에 성공');
  db.run(
    'INSERT INTO messages (text) VALUES (?)',
    ['Hello, SQLite3!'],
    (err) => {
      console.log('데이터 삽입에 성공');
      db.each('SELECT rowid AS id, text FROM messages', (err, row) => {
        console.log(`${row.id}: ${row.text}`);
      });
    }
  );
});

db.close();
