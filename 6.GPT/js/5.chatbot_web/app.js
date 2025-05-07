const express = require('express');
const morgan = require('morgan');
const openai = require('openai');
const path = require('path');
const app = express();
const port = 3000;

require('dotenv').config({ path: '../../../.env' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

const conversationHistory = [];

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  console.log(OPENAI_API_KEY.substring(0, 5));
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { userInput } = req.body;
  console.log(`사용자 입력: ${userInput}`);
  conversationHistory.push({ role: 'user', content: userInput });
  const chatGPTResponse = await getChatGPTResponse();
  conversationHistory.push({ role: 'assistant', content: chatGPTResponse });
  console.log(`ChatGPT 응답: ${chatGPTResponse}`);
  if (!chatGPTResponse) {
    return res.status(500).json({ error: 'ChatGPT 응답 생성 실패' });
  }
  res.json({ message: chatGPTResponse });
});

async function getChatGPTResponse() {
  try {
    const completion = await openaiClient.chat.completions.create({
      messages: [...conversationHistory],
      temperature: 0.7,
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    return '죄송합니다. 응답을 생성하는 동안 오류가 발생했습니다.';
  }
}

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
