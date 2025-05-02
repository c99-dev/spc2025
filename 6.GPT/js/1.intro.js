const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const url = 'https://api.openai.com/v1/responses';
const url = 'https://api.openai.com/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

const data = {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: 'you are a helpful assistant',
    },
    {
      role: 'user',
      content: '점심 메뉴 추천 해줘',
    },
  ],
  temperature: 0.7,
};

axios
  .post(url, data, { headers })
  .then((response) => {
    console.log('Response:', response.data);
    console.log('Response:', response.data.choices[0].message.content);
  })
  .catch((error) => {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
  });
