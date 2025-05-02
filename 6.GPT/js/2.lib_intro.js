require('dotenv').config({ path: '../../.env' });
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const response = await openai.chat.completions.create({
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
  });
  console.log('Response:', response.choices[0].message);
}

main();
