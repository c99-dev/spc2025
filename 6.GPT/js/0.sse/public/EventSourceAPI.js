const eventSource = new EventSource('/events');
const messagesDiv = document.getElementById('messages');
const closeButton = document.getElementById('closeButton');

function logMessage(message) {
  const p = document.createElement('p');
  p.textContent = message;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
}

// 메시지 수신
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  logMessage(`메시지 수신: ${JSON.stringify(data)}`);
  console.log('서버로부터 받은 데이터:', data);
};

// 연결 시작
eventSource.onopen = () => {
  logMessage('SSE 연결이 열렸습니다.');
  console.log('SSE 연결이 열렸습니다.');
};

// 오류 처리
eventSource.onerror = (error) => {
  logMessage('SSE 연결 오류 발생. 콘솔을 확인하세요.');
  console.error('SSE 연결 오류:', error);
  // 오류 발생 시 자동으로 연결이 닫힐 수 있음
  // eventSource.close();
};

// 연결 종료 함수
function closeConnection() {
  if (eventSource.readyState !== EventSource.CLOSED) {
    eventSource.close();
    logMessage('SSE 연결이 수동으로 종료되었습니다.');
    console.log('SSE 연결이 수동으로 종료되었습니다.');
  } else {
    logMessage('SSE 연결은 이미 닫혀 있습니다.');
    console.log('SSE 연결은 이미 닫혀 있습니다.');
  }
}

// 연결 종료 버튼 이벤트 리스너
closeButton.addEventListener('click', closeConnection);

// 페이지를 떠날 때 연결 종료 (선택 사항)
window.addEventListener('beforeunload', () => {
  closeConnection();
});
