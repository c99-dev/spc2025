const express = require('express');
const path = require('path'); // path 모듈 추가
const morgan = require('morgan'); // morgan 모듈 추가
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/events', (req, res) => {
  // SSE 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 클라이언트 ID 생성 (연결 추적용)
  const clientId = Date.now();

  // 주기적으로 이벤트 전송
  const intervalId = setInterval(() => {
    const data = {
      time: new Date().toISOString(),
      clientId: clientId,
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  // 연결이 끊어질 때 리소스 정리
  req.on('close', () => {
    clearInterval(intervalId);
    console.log(`클라이언트 ${clientId} 연결 종료`);
  });
});

app.listen(port, () => {
  console.log(`SSE 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
