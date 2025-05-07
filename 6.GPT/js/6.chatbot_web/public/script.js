const chatContainer = document.getElementById('chat-container');
const userInputForm = document.getElementById('user-input-form');
const userInput = document.getElementById('user-input');
const newChatButton = document.getElementById('new-chat-button');
const currentSessionId = document.getElementById('current-session-id');
const currentSessionCreatedAt = document.getElementById('current-session-date');
const sessionList = document.getElementById('session-list-container');
let currentSession = null;

userInputForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);

  userInput.value = '';

  try {
    // 로딩 메시지 표시
    const loadingId = showLoadingMessage();

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: message,
        sessionId: currentSession.id,
      }),
    });

    if (!response.ok) {
      throw new Error('서버 응답 오류');
    }

    const data = await response.json();

    // 로딩 메시지 제거
    removeLoadingMessage(loadingId);

    appendMessage('chatbot', data.message);
  } catch (error) {
    console.error('오류:', error);
    appendMessage('chatbot', '메시지 전송 중 오류가 발생했습니다.');
  }
});

function appendMessage(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = message;

  messageDiv.appendChild(messageContent);
  chatContainer.appendChild(messageDiv);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (sender !== 'user') {
    userInput.focus();
  }
}

// 로딩 메시지를 표시하는 함수
function showLoadingMessage() {
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('chat-message', 'chatbot');

  const loadingContent = document.createElement('div');
  loadingContent.classList.add('message-content', 'loading-dots');
  loadingContent.textContent = '생각 중';

  loadingDiv.appendChild(loadingContent);
  chatContainer.appendChild(loadingDiv);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  return (loadingDiv.id = 'loading-' + Date.now());
}

// 로딩 메시지를 제거하는 함수
function removeLoadingMessage(id) {
  const loadingElement = document.getElementById(id);
  if (loadingElement) {
    chatContainer.removeChild(loadingElement);
  }
}

async function getSessions() {
  const response = await fetch('/api/sessions', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('서버 응답 오류');
  }

  const { sessions } = await response.json();
  console.log('세션 목록:', sessions);

  sessionList.innerHTML = '';
  sessions.forEach((session) => {
    const sessionDiv = document.createElement('div');
    sessionDiv.classList.add('session-item');
    sessionDiv.textContent = `세션 ID: ${session.id} - 생성일: ${new Date(
      session.created_at
    ).toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    sessionDiv.addEventListener('click', async () => {
      currentSession = session;
      currentSessionId.textContent = session.id;
      currentSessionCreatedAt.textContent = new Date(
        session.created_at
      ).toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      await loadChatHistory();
    });

    sessionList.appendChild(sessionDiv);
  });
}

async function createSession() {
  const response = await fetch('/api/session', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('서버 응답 오류');
  }

  const { session } = await response.json();
  currentSession = session;
  console.log('세션 생성:', currentSession);

  currentSession = session;
  currentSessionId.textContent = session.id;
  currentSessionCreatedAt.textContent = new Date(
    session.created_at
  ).toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  loadChatHistory();
}

async function loadChatHistory() {
  const response = await fetch(`/api/session/${currentSession.id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('서버 응답 오류');
  }
  const { chatHistory } = await response.json();
  console.log('채팅 기록:', chatHistory);

  chatContainer.innerHTML = '';
  userInput.value = '';

  if (!chatHistory) {
    appendMessage('chatbot', '안녕하세요! 무엇을 도와드릴까요?');
    return;
  }
  chatHistory.forEach((message) => {
    appendMessage(
      message.role === 'user' ? 'user' : 'chatbot',
      message.content
    );
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
  console.log('채팅 기록 로드 완료');
}

document.addEventListener('DOMContentLoaded', () => {
  createSession();
  getSessions();
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    userInputForm.dispatchEvent(new Event('submit'));
  }
});

newChatButton.addEventListener('click', () => {
  createSession();
  getSessions();
});
