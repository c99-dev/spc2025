const db = require('better-sqlite3')('test.db');

db.exec(
  'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT)'
);

const allUsers = db.prepare('SELECT * FROM users').all();
console.log('조회된 사용자: ', allUsers);

const newUser = {
  username: 'user1',
  email: 'user1@example.com',
};

const insertUser = db.prepare(
  'INSERT INTO users (username, email) VALUES (?, ?)'
);
insertUser.run(newUser.username, newUser.email);

const userId = 1;
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
console.log('조회된 사용자: ', user);

const updatedUser = {
  id: userId,
  username: 'user001',
  email: 'user001@example.com',
};

const updateUser = db.prepare(
  'UPDATE users SET username = ?, email = ? WHERE id = ?'
);
updateUser.run(updatedUser.username, updatedUser.email, updatedUser.id);

const deleteUser = {
  id: 2,
};

const deleteUserQuery = db.prepare('DELETE FROM users WHERE id = ?');
deleteUserQuery.run(deleteUser.id);

db.close();
