const chatContainer = document.getElementById('chat-container');
const userInputForm = document.getElementById('user-input-form');
const userInput = document.getElementById('user-input');

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
      body: JSON.stringify({ userInput: message }),
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

async function initializeChatSession() {
  const response = await fetch('/api/session', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('서버 응답 오류');
  }

  const { sessionId } = await response.json();
  console.log('세션 ID:', sessionId);

  appendMessage('chatbot', '안녕하세요! 어떤 도움이 필요하신가요?');
  userInput.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeChatSession();
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    userInputForm.dispatchEvent(new Event('submit'));
  }
});
