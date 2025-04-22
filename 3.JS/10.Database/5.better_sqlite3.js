const db = require('better-sqlite3')('test.db');

db.exec(
  'CREATE TABLE IF NOT EXISTS greetings (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)'
);

const insert = db.prepare('INSERT INTO greetings (message) VALUES (?)');
insert.run('Hello, Better SQLite3!');

const select = db.prepare('SELECT * FROM greetings');
const greetings = select.all();
greetings.forEach((row) => {
  console.log(`${row.id}: ${row.message}`);
});
db.close();
