const express = require('express');
const morgan = require('morgan');
const db = require('better-sqlite3')('./db/chatgpt.db');
const session = require('express-session');
const openai = require('openai');
const path = require('path');
const app = express();
const port = 3000;

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

function insertChatHistory(role, content, sessionId) {
  const stmt = db.prepare(
    'INSERT INTO chat_history (role, content, session_id) VALUES (?, ?, ?)'
  );
  stmt.run(role, content, sessionId);
}

function getChatHistory(sessionId) {
  const stmt = db.prepare(
    'SELECT role, content FROM chat_history WHERE session_id = ?'
  );
  return stmt.all(sessionId);
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
