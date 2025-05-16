const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// todo 추가
addButton.addEventListener('click', () => {
  // input 값 읽어서 백엔드 호출
  const todoText = todoInput.value;
  if (todoText.trim() === '') {
    alert('할 일을 입력하세요');
    return;
  }
  fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: todoText }),
  })
    .then((response) => response.json())
    .then((data) => {
      todoInput.value = '';
      renderTodos();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addButton.click();
  }
});

// todo 리스트 렌더링
function renderTodos() {
  fetch('/api/todos')
    .then((response) => response.json())
    .then((data) => {
      const todos = data.rows;
      console.log('getAllTodos\n' + JSON.stringify(data, null, 2));
      todoList.innerHTML = '';
      todos.forEach((todo) => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        if (todo.completed) {
          li.style.textDecoration = 'line-through';
        }
        // li 클릭 시 완료 상태 변경
        li.addEventListener('click', () => {
          toggleTodo(todo.id);
        });
        // 삭제 버튼 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation(); // 클릭 이벤트 전파 방지
          deleteTodo(todo.id);
        });
        li.appendChild(deleteButton);
        todoList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// todo 완료 상태 변경
function toggleTodo(id) {
  fetch(`/api/todos`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('updateTodo\n' + JSON.stringify(data, null, 2));
      renderTodos();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// todo 삭제
function deleteTodo(id) {
  fetch(`/api/todos`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).then((response) => {
    renderTodos();
  });
}

// 메시지 표시 함수
function displayMessage(sender, text) {
  const chatbotMessages = document.querySelector('#chatbotMessages');
  const messageElement = document.createElement('div');
  messageElement.classList.add(
    'message',
    sender === 'user' ? 'user-message' : 'bot-message'
  );

  const messageContent = document.createElement('span');
  // textContent 대신 innerHTML을 사용하고, \n을 <br>로 변환
  messageContent.innerHTML = text.replace(/\n/g, '<br>');

  messageElement.appendChild(messageContent);
  chatbotMessages.appendChild(messageElement);

  // 스크롤을 최하단으로 이동
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// 메시지 전송 및 응답 처리 함수
function sendChatMessage() {
  const chatbotInput = document.querySelector('#chatbotInput');
  const message = chatbotInput.value.trim();

  if (message === '') return;

  // 사용자 메시지 표시
  displayMessage('user', message);

  // 입력창 초기화
  chatbotInput.value = '';

  // 서버로 메시지 전송
  fetch('/api/chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      return response.json();
    })
    .then((data) => {
      // 봇 응답 표시
      displayMessage('bot', data.answer);
      renderTodos();
    })
    .catch((error) => {
      console.error('Error:', error);
      // 오류 발생 시 기본 응답
      displayMessage(
        'bot',
        '죄송합니다. 응답을 처리하는 중 오류가 발생했습니다.'
      );
    });
}

// 모든 이벤트 리스너와 초기화 코드를 DOMContentLoaded 이벤트 내에 배치
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();

  // 챗봇 관련 요소 초기화
  const chatbotIcon = document.querySelector('#chatbotIcon');
  const closeButton = document.querySelector('#closeChatbot');
  const chatBotWindow = document.querySelector('#chatbotWindow');
  const sendButton = document.querySelector('#sendMessage');
  const chatbotInput = document.querySelector('#chatbotInput');

  // 챗봇 아이콘 클릭 시 챗봇 창 열기
  chatbotIcon.addEventListener('click', () => {
    chatBotWindow.style.display = 'block';
    chatbotInput.focus();
  });

  // 챗봇 창 닫기
  closeButton.addEventListener('click', () => {
    chatBotWindow.style.display = 'none';
  });

  // 챗봇 메시지 전송 기능 구현
  sendButton.addEventListener('click', () => {
    sendChatMessage();
  });

  chatbotInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendChatMessage();
    }
  });

  // 챗봇 초기화 메시지
  setTimeout(() => {
    displayMessage(
      'bot',
      '안녕하세요! 무엇을 도와드릴까요? 투두리스트에 대해 질문해보세요.'
    );
  }, 500);
});
