// Express 모듈 가져오기
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Express 애플리케이션 인스턴스 생성
const app = express();
const PORT = 3000;

// JSON 요청 본문을 파싱하기 위한 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// 로그 기록 미들웨어 설정
app.use(morgan('dev'));

// 라우트 설정
const todoRoutes = require('./routes/todoRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 라우터 연결
app.use(todoRoutes);
app.use(chatbotRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
