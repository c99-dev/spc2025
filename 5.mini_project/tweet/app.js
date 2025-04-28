const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// DB 초기화
const sqlite3 = require('better-sqlite3');
const db = new sqlite3(path.join(__dirname, 'tweet.db'));
db.pragma('foreign_keys = ON');
const filePath = path.join(__dirname, 'init_data.sql');
const sqlContent = fs.readFileSync(filePath, 'utf8');
db.exec(sqlContent);

// 로그인 상태 확인 미들웨어 (필요한 라우트에 적용)
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  next();
}

// 메인 API
app.get('/api/tweets', (req, res) => {
  const tweets = db
    .prepare('SELECT * FROM tweet ORDER BY created_at DESC')
    .all();
  res.json(tweets);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // 입력값 검증 (간단하게)
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }
  const user = db
    .prepare(
      'SELECT id, email, username FROM user WHERE email = ? AND password = ?'
    ) // 비밀번호는 실제로는 해싱해야 함
    .get(email, password);

  if (!user) {
    // 401 Unauthorized 사용 (404 대신)
    return res
      .status(401)
      .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }
  req.session.user = user; // 세션에 사용자 정보 저장 (비밀번호 제외)
  res.json(user);
});

// 로그아웃 API
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    res.status(200).json({ message: '로그아웃 성공' });
  });
});

// 로그인 상태 확인 API
app.get('/api/check-login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 트윗 작성 API (로그인 필요)
app.post('/api/tweet', requireLogin, (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: '내용을 입력해주세요.' });
  }
  const userId = req.session.user.id; // 로그인된 사용자 ID 사용
  try {
    const stmt = db.prepare(
      'INSERT INTO tweet (content, user_id) VALUES (?, ?)'
    );
    const info = stmt.run(content.trim(), userId);
    const newTweet = db
      .prepare(
        'SELECT t.*, u.username FROM tweet t JOIN user u ON t.user_id = u.id WHERE t.id = ?'
      ) // 사용자 이름도 함께 조회
      .get(info.lastInsertRowid);
    res.status(201).json(newTweet); // 201 Created 상태 코드 사용
  } catch (error) {
    console.error('Tweet creation error:', error);
    res.status(500).json({ message: '트윗 작성 중 오류가 발생했습니다.' });
  }
});

// 프로필 조회 API (로그인 필요)
app.get('/api/profile', requireLogin, (req, res) => {
  // 세션에서 사용자 정보 반환 (DB 재조회 필요 시 여기서 수행)
  // 현재는 username만 필요하므로 세션 정보 사용
  res.json({ username: req.session.user.username });
});

// 프로필 수정 API (로그인 필요)
app.put('/api/profile', requireLogin, (req, res) => {
  const { username, password } = req.body;
  const userId = req.session.user.id;

  if (!username || username.trim() === '') {
    return res.status(400).json({ message: '사용자명을 입력해주세요.' });
  }

  try {
    if (password && password.trim() !== '') {
      // 비밀번호 변경 로직 (실제로는 해싱 필요)
      db.prepare('UPDATE user SET username = ?, password = ? WHERE id = ?').run(
        username.trim(),
        password,
        userId
      ); // 비밀번호 업데이트
    } else {
      // 사용자명만 변경
      db.prepare('UPDATE user SET username = ? WHERE id = ?').run(
        username.trim(),
        userId
      );
    }

    // 세션 정보 업데이트
    req.session.user.username = username.trim();

    res.json({
      message: '프로필이 성공적으로 업데이트되었습니다.',
      user: req.session.user,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res
      .status(500)
      .json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
