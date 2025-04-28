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
  let tweets;
  const userId = req.session.user ? req.session.user.id : null; // 로그인 사용자 ID 또는 null

  // 사용자 이름(username)과 좋아요 수(like_count), 로그인 사용자의 좋아요 여부(liked)를 함께 조회
  const query = `
    SELECT 
      t.id, t.content, t.created_at, t.user_id, t.like_count,
      u.username,
      CASE WHEN l.user_id IS NOT NULL THEN 1 ELSE 0 END AS liked
    FROM tweet t
    JOIN user u ON t.user_id = u.id
    LEFT JOIN like l ON t.id = l.tweet_id AND l.user_id = ?
    ORDER BY t.created_at DESC
  `;

  try {
    tweets = db.prepare(query).all(userId);
    res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res
      .status(500)
      .json({ message: '트윗 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 좋아요 토글 API (로그인 필요)
app.post('/api/like/:tweetId', requireLogin, (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.session.user.id;

  // 트랜잭션 시작
  const toggleLikeTransaction = db.transaction(() => {
    // 이미 좋아요 했는지 확인
    const existingLike = db
      .prepare('SELECT * FROM like WHERE user_id = ? AND tweet_id = ?')
      .get(userId, tweetId);

    let liked = 0; // 최종 좋아요 상태 (0: 안함, 1: 함)
    let newLikeCount;

    if (existingLike) {
      // 좋아요 취소
      db.prepare('DELETE FROM like WHERE user_id = ? AND tweet_id = ?').run(
        userId,
        tweetId
      );
      db.prepare(
        'UPDATE tweet SET like_count = like_count - 1 WHERE id = ? AND like_count > 0'
      ).run(tweetId);
      liked = 0;
    } else {
      // 좋아요 추가
      db.prepare('INSERT INTO like (user_id, tweet_id) VALUES (?, ?)').run(
        userId,
        tweetId
      );
      db.prepare(
        'UPDATE tweet SET like_count = like_count + 1 WHERE id = ?'
      ).run(tweetId);
      liked = 1;
    }

    // 최신 좋아요 수 조회
    const tweet = db
      .prepare('SELECT like_count FROM tweet WHERE id = ?')
      .get(tweetId);
    newLikeCount = tweet ? tweet.like_count : 0;

    return { liked, newLikeCount };
  });

  try {
    const result = toggleLikeTransaction();
    res
      .status(200)
      .json({
        message: '좋아요 상태가 변경되었습니다.',
        liked: result.liked,
        new_count: result.newLikeCount,
      });
  } catch (error) {
    console.error('Like toggle error:', error);
    // UNIQUE constraint 실패 등 예상 가능한 오류 처리 추가 가능
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      // 동시성 문제 등으로 이미 상태가 변경된 경우 등 처리
      res
        .status(409)
        .json({
          message:
            '좋아요 상태 변경 중 충돌이 발생했습니다. 다시 시도해주세요.',
        });
    } else {
      res.status(500).json({ message: '좋아요 처리 중 오류가 발생했습니다.' });
    }
  }
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
        // username과 liked 상태(항상 0)를 포함하여 반환
        `SELECT t.*, u.username, 0 as liked 
         FROM tweet t 
         JOIN user u ON t.user_id = u.id 
         WHERE t.id = ?`
      )
      .get(info.lastInsertRowid);
    res.status(201).json(newTweet);
  } catch (error) {
    console.error('Tweet creation error:', error);
    res.status(500).json({ message: '트윗 작성 중 오류가 발생했습니다.' });
  }
});

// 프로필 조회 API (로그인 필요)
app.get('/api/profile', requireLogin, (req, res) => {
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
