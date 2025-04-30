const express = require('express');
const morgan = require('morgan');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const { createTables } = require('./db/init');
const User = require('./models/usersModel');
const Notification = require('./models/notificationsModel');

// 애플리케이션 초기화
const app = express();
const port = process.env.PORT || 3000;

// 데이터베이스 초기화
setupDatabase();

// 뷰 엔진 설정
setupViewEngine();

// 미들웨어 설정
setupMiddlewares();

// 사용자 인증 미들웨어 설정
setupAuthMiddleware();

// 라우트 설정
setupRoutes();

// 서버 시작
startServer();

// 데이터베이스 설정 함수
function setupDatabase() {
  createTables();
}

// 뷰 엔진 설정 함수
function setupViewEngine() {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('layout', 'layout');
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, 'public')));
}

// 미들웨어 설정 함수
function setupMiddlewares() {
  // 요청 파싱 미들웨어
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 세션 설정
  app.use(
    session({
      secret: 'music-board-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1일
    })
  );

  // 플래시 메시지 설정
  app.use(flash());

  // 플래시 메시지 전역 설정
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });

  // 현재 경로 정보 미들웨어
  app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
}

// 인증 관련 미들웨어 설정 함수
function setupAuthMiddleware() {
  // 사용자 인증 미들웨어
  app.use(async (req, res, next) => {
    res.locals.user = null;
    if (req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        if (user) {
          res.locals.user = user;
        }
      } catch (err) {
        console.error('사용자 조회 오류:', err);
      }
    }
    next();
  });

  // 알림 카운트 미들웨어
  app.use(async (req, res, next) => {
    if (req.session.userId) {
      try {
        const unreadCount = await Notification.getUnreadCountByUserId(
          req.session.userId
        );
        res.locals.unreadNotificationCount = unreadCount;
      } catch (err) {
        console.error('알림 카운트 조회 오류:', err);
        res.locals.unreadNotificationCount = 0;
      }
    }
    next();
  });
}

// 라우트 설정 함수
function setupRoutes() {
  // 라우트 모듈 불러오기
  const home = require('./routes/homeRoute');
  const topLikes = require('./routes/topLikesRoute');
  const hashtags = require('./routes/hashtagsRoute');
  const auth = require('./routes/authRoute');
  const api = require('./routes/apiRoute');
  const music = require('./routes/musicRoute');
  const profile = require('./routes/profileRoute');
  const notifications = require('./routes/notificationsRoute');
  const admin = require('./routes/adminRoute');

  // 라우트 등록
  app.use('/', home);
  app.use('/topLikes', topLikes);
  app.use('/hashtags', hashtags);
  app.use('/auth', auth);
  app.use('/api', api);
  app.use('/music', music);
  app.use('/profile', profile);
  app.use('/notifications', notifications);
  app.use('/admin', admin);
}

// 서버 시작 함수
function startServer() {
  app.listen(port, () => {
    console.log(`서버 여기서 실행 중 http://localhost:${port}`);
  });
}
