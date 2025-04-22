const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  db.close();
}

(async () => {
  await runQuery('CREATE TABLE IF NOT EXISTS messages (text TEXT)');
  await runQuery('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite3!']);
  console.log('동기화되는곳');
})();
