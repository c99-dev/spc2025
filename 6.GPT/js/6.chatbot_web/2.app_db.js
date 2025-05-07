const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const openai = require('openai');

const db = require('better-sqlite3')('./db/chatgpt.db');

const app = express();
const path = require('path');
const port = 3000;

const maxHistoryLength = 10;

require('dotenv').config({ path: '../../../.env' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

const sessionStore = new session.MemoryStore();
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  console.log(OPENAI_API_KEY.substring(0, 5));
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body;
  const sessionId = req.session.id;
  const conversationHistory = getChatHistory(sessionId);
  console.log('대화 기록:', conversationHistory);
  console.log(`사용자 입력: ${userInput}`);
  insertChatHistory('user', userInput, sessionId);
  const chatGPTResponse = await getChatGPTResponse(
    conversationHistory.concat({ role: 'user', content: userInput })
  );
  insertChatHistory('assistant', chatGPTResponse, sessionId);
  console.log(`ChatGPT 응답: ${chatGPTResponse}`);
  if (!chatGPTResponse) {
    return res.status(500).json({ error: 'ChatGPT 응답 생성 실패' });
  }
  res.json({ message: chatGPTResponse });
});

async function getChatGPTResponse(messages) {
  console.log('messages: ', messages);
  try {
    const completion = await openaiClient.chat.completions.create({
      messages,
      temperature: 0.7,
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    return '죄송합니다. 응답을 생성하는 동안 오류가 발생했습니다.';
  }
}

app.delete('/api/chat', (req, res) => {
  const sessionId = req.session.id;
  clearChatHistory(sessionId);
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 종료 중 오류 발생:', err);
      return res.status(500).json({ error: '세션 종료 실패' });
    }
    console.log('세션 종료됨:', sessionId);
    res.json({ message: '세션 종료됨' });
  });
});

function insertChatHistory(role, content, sessionId) {
  const stmt = db.prepare(
    'INSERT INTO chat_history (role, content, session_id) VALUES (?, ?, ?)'
  );
  stmt.run(role, content, sessionId);
}

function getChatHistory(sessionId) {
  const stmt = db.prepare(
    `SELECT role, content FROM chat_history WHERE session_id = ? ORDER BY id DESC LIMIT ${maxHistoryLength}`
  );
  const rows = stmt.all(sessionId);
  return rows.reverse();
}

function clearChatHistory(sessionId) {
  const stmt = db.prepare('DELETE FROM chat_history WHERE session_id = ?');
  stmt.run(sessionId);
}

function resetDatabase() {
  const stmt = db.prepare('DROP TABLE IF EXISTS chat_history');
  stmt.run();
  const stmtCreate = db.prepare(`
    CREATE TABLE chat_history (
      id SERIAL PRIMARY KEY,
      role INT NOT NULL,
      content TEXT NOT NULL,
      session_id TEXT NOT NULL
    )
  `);
  stmtCreate.run();
}

resetDatabase();

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
