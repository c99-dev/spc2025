const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// 메시지를 채팅 기록에 추가하는 함수
function addMessage(sender, message) {
  const messageElement = document.createElement('p');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatHistory.appendChild(messageElement);
  moveScrollToBottom();
}

function moveScrollToBottom() {
  chatHistory.scrollTop = chatHistory.scrollHeight; // 스크롤을 맨 아래로 이동
}

// 전송 버튼 클릭 이벤트 리스너
sendButton.addEventListener('click', async () => {
  const message = messageInput.value.trim();
  if (!message) return; // 메시지가 비어있으면 아무것도 하지 않음

  addMessage('나', message); // 사용자 메시지 표시
  messageInput.value = ''; // 입력 필드 초기화

  try {
    // 서버 API 호출
    const response = await fetch(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    addMessage('GPT', data.reply); // GPT 응답 표시
  } catch (error) {
    console.error('Error fetching chat:', error);
    addMessage('오류', '메시지를 가져오는 데 실패했습니다.');
  }
});

// Enter 키로 메시지 전송
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
