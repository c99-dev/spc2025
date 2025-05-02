const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// 메시지를 채팅 기록에 추가하는 함수
function addMessage(sender, message) {
  const messageElement = document.createElement('p');
  if (sender === '나') {
    messageElement.className = 'message user-message'; // 사용자 메시지 스타일
  } else {
    messageElement.className = 'message gpt-message';
  }
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

  addMessage('GPT', ''); // GPT 응답을 위한 빈 메시지 추가
  await fetchStreamingData(message);
});

// Enter 키로 메시지 전송
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});

async function fetchStreamingData(message) {
  try {
    const response = await fetch('http://localhost:3000/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.body) {
      console.error('Response body is not a readable stream');
      return;
    }

    // 텍스트 디코더를 사용하여 바이트 스트림을 문자열로 변환
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let receivedMarkdown = ''; // Markdown 텍스트 누적 변수
    const dataElements = document.querySelectorAll('.message');
    const dataElement = dataElements[dataElements.length - 1];
    dataElement.innerHTML = '<strong>GPT: </strong> '; // 초기 GPT 메시지 표시

    // 스트림에서 데이터를 읽습니다.
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        console.log('스트림 완료');
        // 스트림 완료 후 Markdown 렌더링
        if (typeof marked !== 'undefined') {
          // marked 라이브러리가 로드되었는지 확인
          const renderedHtml = marked.parse(receivedMarkdown); // Markdown을 HTML로 변환
          dataElement.innerHTML = '<strong>GPT: </strong> ' + renderedHtml; // 렌더링된 HTML로 업데이트
        } else {
          console.error('marked library is not loaded.');
          // marked가 없으면 누적된 텍스트 그대로 표시 (기존 방식 유지)
          dataElement.innerHTML = '<strong>GPT: </strong> ' + receivedMarkdown;
        }
        chatHistory.scrollTop = chatHistory.scrollHeight; // 최종 스크롤 조정
        break;
      }

      // value는 읽은 텍스트 청크입니다.
      receivedMarkdown += value; // Markdown 텍스트 누적
      console.log('Received chunk:', value); // 콘솔에서 청크 확인
      if (dataElement) {
        dataElement.innerHTML = '<strong>GPT: </strong> ' + receivedMarkdown;
        moveScrollToBottom();
      }
    }
  } catch (error) {
    console.error('Error fetching stream:', error);
    const dataElements = document.querySelectorAll('.message');
    const dataElement = dataElements[dataElements.length - 1];
    if (dataElement) {
      dataElement.innerHTML = '<strong>GPT: </strong> 오류가 발생했습니다.';
    }
  }
}
