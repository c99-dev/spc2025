const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const db = require('better-sqlite3')('notepad.db');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public', 'images');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일(jpg, png, gif)만 업로드 가능합니다.'));
  }
};

const upload = multer({ storage, fileFilter });

function deleteImageFile(imagePath) {
  const fullPath = path.join(__dirname, 'public', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('이미지 파일 삭제 실패:', err);
    } else {
      console.log('이미지 파일 삭제 완료:', fullPath);
    }
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: '제목과 내용을 모두 입력해주세요.' });
  }

  const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  const result = stmt.run(title, content);

  if (result.changes === 0)
    return res.status(400).json({ message: '저장 실패' });
  res.status(201).json({ message: '저장 완료', id: result.lastInsertRowid });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('SELECT image_path FROM notes WHERE id = ?');
  const note = stmt.get(id);
  if (!note) {
    return res.status(404).json({ message: '삭제할 메모를 찾을 수 없습니다.' });
  }
  const deleteStmt = db.prepare('DELETE FROM notes WHERE id = ?');
  const result = deleteStmt.run(id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '삭제할 메모를 찾을 수 없습니다.' });
  }
  if (note.image_path) {
    deleteImageFile(note.image_path);
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
    return res.status(404).json({ message: '수정할 메모를 찾을 수 없습니다.' });
  }
  const selectStmt = db.prepare('SELECT image_path FROM notes WHERE id = ?');
  const note = selectStmt.get(id);
  deleteImageFile(note.image_path);
  res.json({ message: '수정 완료' });
});

app.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
  }
  const { noteId } = req.body;
  const imagePath =
    '/' + path.join('images', req.file.filename).replaceAll('\\', '/');
  const updateStmt = db.prepare('UPDATE notes SET image_path = ? WHERE id = ?');
  updateStmt.run(imagePath, noteId);
  if (updateStmt.changes === 0) {
    return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
  }
  res.json({ message: '이미지 업로드 완료' });
});

app.delete('/image/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('SELECT image_path FROM notes WHERE id = ?');
  const note = stmt.get(id);
  if (!note) {
    return res.status(404).json({ message: '삭제할 메모를 찾을 수 없습니다.' });
  }
  deleteImageFile(note.image_path);
});

app.listen(PORT, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${PORT}`);
});
