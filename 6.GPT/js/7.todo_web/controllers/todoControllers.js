const todoModel = require('../models/todoModel');

function getAllTodos(req, res) {
  const rows = todoModel.getAllTodos();
  res.json({ rows, message: '투두 목록 조회 완료' });
}

function addTodo(req, res) {
  const newTodo = todoModel.addTodo(req.body.title);
  res.status(201).json({ newTodo, message: '투두 추가 완료' });
}

function toggleTodo(req, res) {
  const todo = todoModel.getTodoById(req.body.id);
  console.log(todo);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todoModel.toggleTodoStatus(req.body.id, todo.completed);
  res.status(200).json({
    id: req.body.id,
    title: todo.title,
    completed: !todo.completed,
  });
}

function deleteTodo(req, res) {
  const todo = todoModel.getTodoById(req.body.id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  todoModel.deleteTodoById(req.body.id);
  res.status(204).json({ todo, message: '투두 삭제 완료' });
}

module.exports = {
  getAllTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
};
