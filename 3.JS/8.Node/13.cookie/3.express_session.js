const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(session({ secret: 'asdf', resave: false, saveUninitialized: true }));

function visitCounter(req, res, next) {
  req.session.visitCount = req.session.visitCount || 0;
  req.session.visitCount++;
  next();
}

app.use(visitCounter);

app.get('/', (req, res) => {
  req.session.ticket = 'abcd';
  req.session.cart = ['apple', 'banana', 'orange'];
  res.send('당신의 방문 횟수: ' + req.session.visitCount);
});

app.get('/cart', (req, res) => {
  const yoursession = req.session;
  const ticket = yoursession.ticket;
  const cart = yoursession.cart;
  res.send(`장바구니: ${cart}, 티켓: ${ticket}`);
});

app.get('/user', (req, res) => {
  const yoursession = req.session;
  yoursession.user = { name: '홍길동', age: 20 };
  res.send(`사용자 정보: ${yoursession.user.name}, ${yoursession.user.age}`);
});

app.get('/readsession', (req, res) => {
  const yoursession = req.session;
  const ticket = yoursession.ticket;
  const cart = yoursession.cart;
  const user = yoursession.user;
  if (!user) {
    return res.send('사용자 정보가 없습니다.');
  }
  if (!ticket) {
    return res.send('티켓 정보가 없습니다.');
  }
  res.send(
    `장바구니: ${cart}, 티켓: ${ticket}, 사용자 정보: ${user.name}, ${user.age}`
  );
});

app.get('/destroy', (req, res) => {
  req.session.destroy((err) => {
    res.send('세션 삭제 성공');
  });
});

app.listen(PORT, () => {
  console.log(`서버 여기서 실행 중 http://localhost:${PORT}`);
});
