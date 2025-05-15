const db = require('./database');

function getAllTodos() {
  return db.prepare('SELECT * FROM todos').all();
}

function addTodo(title) {
  const stmt = db.prepare('INSERT INTO todos (title) VALUES (?)');
  const info = stmt.run(title);
  return {
    id: info.lastInsertRowid,
    title: title,
    completed: false,
  };
}

function getTodoById(id) {
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
  return stmt.get(id);
}

function getTodoByTitle(title) {
  const stmt = db.prepare('SELECT * FROM todos WHERE title = ?');
  return stmt.get(title);
}

function toggleTodoStatus(id, completed) {
  const stmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
  stmt.run(completed ? 0 : 1, id);
}

function deleteTodoById(id) {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  stmt.run(id);
}

function deleteAllTodos() {
  const stmt = db.prepare('DELETE FROM todos');
  stmt.run();
}

module.exports = {
  getAllTodos,
  addTodo,
  getTodoById,
  getTodoByTitle,
  toggleTodoStatus,
  deleteTodoById,
  deleteAllTodos,
};
