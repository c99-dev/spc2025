const axios = require('axios');
const todoModel = require('../models/todoModel'); // todoModel 경로는 실제 프로젝트 구조에 맞게 조정 필요

// Python Flask 서버의 주소
const PYTHON_SERVER_URL = 'http://localhost:5000/chatgpt'; // Flask 서버 주소

// Python Flask 서버에 ChatGPT 요청을 보내는 함수
async function requestChatGPTFromPython(message) {
  try {
    // Python 서버로 메시지를 POST 요청으로 전송
    const response = await axios.post(PYTHON_SERVER_URL, { message });
    // Python 서버로부터 받은 응답 데이터를 반환
    return response.data;
  } catch (error) {
    console.error(
      'Python 서버로부터 ChatGPT를 요청하는 중 오류 발생:', // 변경
      error.message
    );
    // 오류 응답 구조화
    if (error.response) {
      // Python 서버가 오류 응답을 반환한 경우
      console.error('Python 서버 응답 데이터:', error.response.data); // 변경
      console.error('Python 서버 응답 상태:', error.response.status); // 변경
      return {
        success: false,
        error: `Python 서버 오류: ${
          error.response.data.error || error.message
        }`,
      };
    } else if (error.request) {
      // 요청은 이루어졌으나 응답을 받지 못한 경우
      console.error('Python 서버로부터 응답을 받지 못했습니다:', error.request); // 변경
      return {
        success: false,
        error: 'Python 서버로부터 응답을 받지 못했습니다.',
      };
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error(
        'Python 서버에 요청 설정 중 오류 발생:', // 변경
        error.message
      );
      return { success: false, error: `요청 설정 오류: ${error.message}` };
    }
  }
}

async function chat(req, res) {
  console.log('Python 서버 응답 요청 본문:', req.body); // 변경: 사용자 입력 값 로그
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: '메시지가 제공되지 않았습니다.' });
  }

  try {
    // Python 서버를 통해 ChatGPT 결과 요청
    const resultFromPython = await requestChatGPTFromPython(message);

    if (!resultFromPython || !resultFromPython.success) {
      console.error(
        'Python 서버로부터 유효한 응답을 받지 못했습니다:',
        resultFromPython
      );
      return res.status(500).json({
        error:
          resultFromPython.error || 'Python 서버 통신 중 오류가 발생했습니다.',
      });
    }

    // Python 서버로부터 받은 content는 JSON 문자열이므로 파싱
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(resultFromPython.content);
    } catch (parseError) {
      console.error(
        'Python 서버의 JSON 응답 파싱 실패:', // 변경
        resultFromPython.content,
        parseError
      );
      return res.status(500).json({
        error: 'Python 서버로부터 받은 응답을 파싱하는데 실패했습니다.',
      });
    }

    const { action, title, titles, target } = jsonResponse;
    let serverReply = jsonResponse.reply; // 초기 reply 값은 Python 서버에서 생성된 것을 사용

    console.log('Python으로부터 파싱된 JSON 응답:', jsonResponse); // 변경: Python 서버에서 온 JSON 로그

    // action에 따라 다른 동작 수행
    switch (action) {
      case 'add':
        if (title) {
          todoModel.addTodo(title);
        } else {
          serverReply =
            '추가할 투두의 제목을 찾지 못했습니다. 다시 시도해주세요.';
        }
        break;
      case 'add_multiple':
        if (titles && Array.isArray(titles) && titles.length > 0) {
          titles.forEach((itemTitle) => {
            todoModel.addTodo(itemTitle);
          });
        } else {
          serverReply =
            '추가할 투두 목록이 유효하지 않습니다. 다시 시도해주세요.';
        }
        break;
      case 'delete':
        if (title) {
          const todoToDelete = todoModel.getTodoByTitle(title);
          if (todoToDelete) {
            todoModel.deleteTodoById(todoToDelete.id);
          } else {
            serverReply = `'${title}' 항목을 찾지 못해 삭제할 수 없습니다.`;
          }
        } else {
          serverReply =
            '삭제할 투두의 제목을 찾지 못했습니다. 다시 시도해주세요.';
        }
        break;
      case 'delete_multiple':
        if (titles && Array.isArray(titles) && titles.length > 0) {
          titles.forEach((itemTitle) => {
            const todoToDelete = todoModel.getTodoByTitle(itemTitle);
            if (todoToDelete) {
              todoModel.deleteTodoById(todoToDelete.id);
            } else {
              // Python/OpenAI가 생성한 reply에 이미 누락된 항목에 대한 정보가 있을 것으로 기대
              console.log(`삭제할 투두를 찾지 못했습니다: ${itemTitle}`);
            }
          });
        } else {
          console.error('삭제할 투두 제목 목록이 유효하지 않습니다.');
          serverReply =
            '삭제할 투두 목록이 유효하지 않거나 제공되지 않았습니다. 다시 시도해주세요.';
        }
        break;
      case 'delete_all':
        if (target === 'all') {
          todoModel.deleteAllTodos();
        } else {
          serverReply = '잘못된 전체 삭제 명령입니다.';
        }
        break;
      case 'toggle':
        if (title) {
          const todoToToggle = todoModel.getTodoByTitle(title);
          if (todoToToggle) {
            todoModel.toggleTodoStatus(todoToToggle.id, todoToToggle.completed);
          } else {
            serverReply = `'${title}' 항목을 찾지 못해 상태를 변경할 수 없습니다.`;
          }
        } else {
          serverReply =
            '상태를 변경할 투두의 제목을 찾지 못했습니다. 다시 시도해주세요.';
        }
        break;
      case 'summarize':
        break;
      case 'list':
        break;
      case 'help':
        break;
      default:
        console.error('알 수 없는 action:', action); // 알 수 없는 action은 오류로 로깅
        serverReply = '알 수 없는 명령입니다. 다시 시도해주세요.';
        break;
    }

    const responsePayload = {
      answer: serverReply, // 최종적으로 사용자에게 전달될 응답
    };
    res.json(responsePayload);
  } catch (error) {
    console.error('Chat 컨트롤러 (Python 연동) 오류:', error); // 변경
    // 클라이언트에는 일반적인 오류 메시지를 반환
    res
      .status(500)
      .json({ error: error.message || '서버 내부 오류가 발생했습니다.' });
  }
}

module.exports = {
  chat,
};
