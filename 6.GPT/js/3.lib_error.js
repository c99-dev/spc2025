require('dotenv').config({ path: '../../.env' });
const { stat } = require('fs');
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('API 키를 찾을 수 없습니다. .env 파일을 확인하세요.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'you are a helpful assistant',
        },
        {
          role: 'user',
          content: '한식 점심 메뉴 추천 해줘',
        },
      ],
      temperature: 0.7,
    });
    console.log('응답:', response.choices[0].message.content);
  } catch (error) {
    const statusCode = error.response ? error.response.status : null;
    if (!statusCode) {
      console.error(`HTTP 에러: ${statusCode}`);
    } else if (statusCode === 401) {
      console.error('인증 에러: API 키가 잘못되었거나 만료되었습니다.');
    } else if (statusCode === 403) {
      console.error('접근 거부: API 키에 대한 권한이 없습니다.');
    } else if (statusCode === 429) {
      console.error('요청 제한 초과: 너무 많은 요청을 보냈습니다.');
    } else if (statusCode >= 500) {
      console.error('서버 에러: OpenAI 서버에서 문제가 발생했습니다.');
    } else if (error.response) {
      console.error('응답 에러:', error.response.data);
    } else {
      console.error('네트워크 에러:', error.message);
    }
  }
}

main();
