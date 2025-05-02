const express = require('express');
const morgan = require('morgan');
const openai = require('openai');
const path = require('path');

require('dotenv').config({ path: '../../../.env' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 에러' });
  }
});

app.post('/api/stream', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });
    for await (const event of response) {
      if (event.choices[0].delta.content) {
        // console.log(event.choices[0].delta.content);
        res.write(event.choices[0].delta.content);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 에러' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
