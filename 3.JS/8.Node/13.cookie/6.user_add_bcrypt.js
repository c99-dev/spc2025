const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

db = new sqlite.Database('users.db');

async function insertUsers() {
  const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
    { id: 3, username: 'user3', password: 'password3' },
  ];
  for (const user of users) {
    const hash = bcrypt.hashSync(user.password, 10);
    await db.run(
      `insert into users (id, username, password) values (?, ?, ?)`,
      [user.id, user.username, hash]
    );
  }
}

async function dropDb() {
  await db.run(`drop table if exists users`);
}

async function createTable() {
  await db.run(
    `create table if not exists users (id integer primary key, username text, password text)`
  );
}

// dropDb();
// createTable();
insertUsers();
