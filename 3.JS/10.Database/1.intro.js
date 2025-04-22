const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

db.run('CREATE TABLE IF NOT EXISTS messages (text TEXT)');
db.run('INSERT INTO messages (text) VALUES (?)', ['Hello, SQLite3!']);

db.each('SELECT rowid AS id, text FROM messages', (err, row) => {
  if (err) throw err;
  console.log(`${row.id}: ${row.text}`);
});
db.close();
