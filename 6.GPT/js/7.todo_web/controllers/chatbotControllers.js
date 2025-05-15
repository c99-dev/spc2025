const openai = require('openai');
const todoModel = require('../models/todoModel');

require('dotenv').config({ path: '../../../../.env' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

// ChatGPT API 요청 함수
async function requestChatGPT(message) {
  try {
    const systemPrompt = `
너는 투두리스트에 대응하는 챗봇입니다.
사용자의 자연어 명령을 이해하고, 이를 바탕으로 투두리스트를 관리하기 위한 JSON 명령을 생성해야 합니다.
답변은 다른 설명 없이 오직 JSON 형식으로만 제공해야 하며, JSON 마크다운 태그는 사용하지 마세요.

JSON 형식은 다음과 같아야 합니다:
{
  "action": "명령_종류", // 예: "add", "add_multiple", "delete", "delete_all", "toggle", "summarize", "list"
  "title": "단일_항목_제목", // 단일 항목 대상일 경우 사용
  "titles": ["복수_항목_제목1", "복수_항목_제목2"], // 복수 항목 대상일 경우 사용 (action이 "add_multiple" 등일 때)
  "target": "대상_지정", // 예: "all" (action이 "delete_all" 등일 때), "pending", "completed" (action이 "list" 등일 때)
  "reply": "사용자에게_보여줄_응답_메시지"
}

'title', 'titles', 'target' 필드는 'action'에 따라 선택적으로 사용됩니다.

예시:
1. 단일 항목 추가: "장보기 추가해줘"
   { "action": "add", "title": "장보기", "reply": "투두리스트에 '장보기'를 추가했습니다." }
2. 여러 항목 추가: "숙제랑 운동 추가해"
   { "action": "add_multiple", "titles": ["숙제", "운동"], "reply": "투두리스트에 '숙제', '운동'을 추가했습니다." }
3. 특정 항목 삭제: "장보기 삭제해"
   { "action": "delete", "title": "장보기", "reply": "'장보기' 항목을 삭제했습니다." }
4. 모든 항목 삭제: "모든 할일 삭제해줘"
   { "action": "delete_all", "target": "all", "reply": "모든 할일을 삭제했습니다." }
5. 특정 항목 완료/미완료 토글: "숙제 완료 처리해"
   { "action": "toggle", "title": "숙제", "reply": "'숙제' 항목의 완료 상태를 변경했습니다." }
6. 할 일 요약: "오늘 할 일 요약해줘"
   { "action": "summarize", "reply": "오늘의 할 일은 총 5개이며, 미완료된 항목은 3개입니다. 주요 미완료 항목은 '보고서 작성', '팀 회의 준비'입니다." }
7. 할 일 목록 보기 (전체, 미완료, 완료): "미완료된 할 일 목록 보여줘"
   { "action": "list", "target": "pending", "reply": "미완료된 할 일 목록입니다: [보고서 작성, 팀 회의 준비, 이메일 확인]" }

사용자의 다양한 표현을 이해하고 위 형식에 맞춰 JSON을 생성해주세요. 'reply' 필드에는 사용자에게 전달할 최종 메시지를 포함해야 합니다.
    `;
    const apiResponse = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.2,
    });

    const { choices } = apiResponse;
    if (choices && choices.length > 0) {
      return { success: true, content: choices[0].message.content };
    } else {
      return { success: false, error: 'ChatGPT 응답이 없습니다' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}

// chat 함수를 async로 변경
async function chat(req, res) {
  console.log(req.body);
  const { message } = req.body;

  try {
    // await를 사용하여 동기적으로 실행
    const result = await requestChatGPT(message);
    // JSON 형태로 파싱
    let jsonResponse = JSON.parse(result.content); // let으로 변경하여 reply 수정 가능하도록 함
    const { action, title, titles, target } = jsonResponse; 
    let serverReply = jsonResponse.reply; // 초기 reply 값 설정

    console.log('Parsed JSON Response:', jsonResponse); 
    console.log(`Action: ${action}, Title: ${title}, Titles: ${titles}, Target: ${target}, Reply: serverReply`);

    // action에 따라 다른 동작 수행
    switch (action) {
      case 'add':
        // 투두 추가 로직
        if (title) {
          todoModel.addTodo(title);
          console.log(`투두 추가: ${title}`);
        } else {
          console.error('추가할 투두 제목이 없습니다.');
        }
        break;
      case 'add_multiple': // 다중 추가 처리
        if (titles && Array.isArray(titles)) {
          titles.forEach((itemTitle) => {
            todoModel.addTodo(itemTitle);
            console.log(`투두 추가: ${itemTitle}`);
          });
        } else {
          console.error('추가할 투두 제목 목록이 유효하지 않습니다.');
        }
        break;
      case 'delete':
        // 투두 삭제 로직
        if (title) {
          const todoToDelete = todoModel.getTodoByTitle(title);
          if (todoToDelete) {
            todoModel.deleteTodoById(todoToDelete.id);
            console.log(`투두 삭제: ${title}`);
          } else {
            console.log(`삭제할 투두를 찾지 못했습니다: ${title}`);
          }
        } else {
          console.error('삭제할 투두 제목이 없습니다.');
        }
        break;
      case 'delete_all': // 전체 삭제 처리
        if (target === 'all') {
          todoModel.deleteAllTodos();
          console.log('모든 투두 삭제 완료');
        } else {
          console.error('잘못된 전체 삭제 대상입니다.');
        }
        break;
      case 'toggle':
        // 투두 완료 상태 변경 로직
        if (title) {
          const todoToToggle = todoModel.getTodoByTitle(title);
          if (todoToToggle) {
            todoModel.toggleTodoStatus(todoToToggle.id, todoToToggle.completed);
            console.log(`투두 완료 상태 변경: ${title}`);
          } else {
            console.log(`상태를 변경할 투두를 찾지 못했습니다: ${title}`);
          }
        } else {
          console.error('상태를 변경할 투두 제목이 없습니다.');
        }
        break;
      case 'summarize': // 할 일 요약 처리
        {
          console.log('할 일 요약 요청');
          const allTodos = todoModel.getAllTodos();
          const totalCount = allTodos.length;
          const completedCount = allTodos.filter(todo => todo.completed).length;
          const pendingCount = totalCount - completedCount;
          serverReply = `현재 총 ${totalCount}개의 할 일이 있습니다. 완료된 할 일은 ${completedCount}개, 미완료된 할 일은 ${pendingCount}개입니다.`;
          if (pendingCount > 0) {
            const pendingTitles = allTodos.filter(todo => !todo.completed).map(todo => todo.title).slice(0, 3); // 최대 3개 표시
            serverReply += ` 주요 미완료 할 일: ${pendingTitles.join(', ')}${pendingCount > 3 ? ' 등' : ''}.`;
          }
        }
        break;
      case 'list': // 할 일 목록 보기 처리
        {
          console.log(`할 일 목록 요청: ${target}`);
          const allTodos = todoModel.getAllTodos();
          let filteredTodos = [];
          let listTitle = "";

          if (target === 'pending') {
            filteredTodos = allTodos.filter(todo => !todo.completed);
            listTitle = "미완료된";
          } else if (target === 'completed') {
            filteredTodos = allTodos.filter(todo => todo.completed);
            listTitle = "완료된";
          } else { // 'all' 또는 지정되지 않은 경우
            filteredTodos = allTodos;
            listTitle = "모든";
          }

          if (filteredTodos.length > 0) {
            const todoTitles = filteredTodos.map(todo => todo.title);
            serverReply = `${listTitle} 할 일 목록입니다: ${todoTitles.join(', ')}.`;
          } else {
            serverReply = `${listTitle} 할 일이 없습니다.`;
          }
        }
        break;
      default:
        console.error('알 수 없는 action:', action);
    }

    if (result.success) {
      const responsePayload = {
        answer: serverReply, // 수정된 serverReply 사용
      };
      res.json(responsePayload);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  chat,
};
