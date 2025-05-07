const express = require('express');
const morgan = require('morgan');

const openai = require('openai');

const db = require('better-sqlite3')('./db/chatgpt.db');

const app = express();
const path = require('path');
const port = 3000;

const maxHistoryLength = 10;

require('dotenv').config({ path: '../../../.env' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(express.json());

app.get('/', (req, res) => {
  console.log(OPENAI_API_KEY.substring(0, 5));
  res.sendFile(path.join(__dirname, 'public', 'index_session.html'));
});

app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body;
  const sessionId = req.body.sessionId;
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

app.get('/api/session', (req, res) => {
  const stmt = db.prepare('SELECT id FROM session');
  const sessions = stmt.all();
  res.json({ sessions: sessions });
});

app.post('/api/session', (req, res) => {
  const result = db
    .prepare('INSERT INTO session (id, created_at) VALUES (NULL, NULL)')
    .run();
  res.json({ sessionId: result.lastInsertRowid });
});

app.get('/api/session/:id', (req, res) => {
  const sessionId = req.params.id;
  const stmt = db.prepare('SELECT id FROM session WHERE id = ?');
  const session = stmt.get(sessionId);
  if (!session) {
    const insertStmt = db.prepare(
      'INSERT INTO session (id, created_at) VALUES (NULL, NULL)'
    );
    const result = insertStmt.run();
    return res.json({ sessionId: result.lastInsertRowid });
  }
  res.json({ sessionId: session.id });
});

function insertChatHistory(role, content, sessionId) {
  const stmt = db.prepare(
    'INSERT INTO chat_history (role, content, session_id) VALUES (?, ?, ?)'
  );
  stmt.run(role, content, sessionId);
  console.log(`대화 기록 삽입됨: ${role} - ${content}`);
  console.log(`세션 ID: ${sessionId}`);
}

function getChatHistory(sessionId) {
  const stmt = db.prepare(
    `SELECT role, content FROM chat_history WHERE session_id = ? ORDER BY id DESC LIMIT ${maxHistoryLength}`
  );
  const rows = stmt.all(sessionId);
  return rows.reverse();
}

function resetDatabase() {
  db.exec(`
    DROP TABLE IF EXISTS chat_history;
    DROP TABLE IF EXISTS session;

    CREATE TABLE session(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      session_id INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE
    );
  `);
}

resetDatabase();

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
