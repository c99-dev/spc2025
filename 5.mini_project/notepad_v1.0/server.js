const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = 3000;
const db = require('better-sqlite3')('notepad.db');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const stmt = db.prepare(
    'INSERT INTO notes (title, content, image_path) VALUES (?, ?, ?)'
  );
  stmt.run(title, content, 'test.png');
  if (stmt.changes === 0) {
    return res.status(500).send();
  }
  res.status(201).json({ message: '저장 완료' });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  const result = stmt.run(id);
  if (result.changes === 0) {
    return res.status(404).send();
  }
  res.json({ message: '삭제 완료' });
});

app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const stmt = db.prepare(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?'
  );
  const result = stmt.run(title, content, id);
  if (result.changes === 0) {
    return res.status(404).send();
  }
  res.json({ message: '수정 완료' });
});

app.listen(PORT, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${PORT}`);
});
