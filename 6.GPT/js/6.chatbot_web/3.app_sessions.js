const express = require('express');
const morgan = require('morgan');
const openai = require('openai');
const path = require('path');
const db = require('./db/database');

const app = express();
const port = 3000;

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
  const { userInput, sessionId } = req.body;
  const conversationHistory = db.getChatHistory(sessionId);
  console.log('대화 기록:', conversationHistory);
  console.log(`사용자 입력: ${userInput}`);
  db.insertChatHistory('user', userInput, sessionId);
  const chatGPTResponse = await getChatGPTResponse(
    conversationHistory.concat({ role: 'user', content: userInput })
  );
  db.insertChatHistory('assistant', chatGPTResponse, sessionId);
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

app.get('/api/sessions', (req, res) => {
  const sessions = db.getSessions();
  console.log('세션 목록:', sessions);
  res.json({ sessions });
});

app.post('/api/session', (req, res) => {
  const session = db.createSession();
  console.log('세션 생성:', session);
  res.json({ session });
});

app.get('/api/session/:id', (req, res) => {
  const sessionId = req.params.id;
  const chatHistory = db.getChatHistory(sessionId);
  console.log('세션 조회:', chatHistory);
  res.json({ chatHistory });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
