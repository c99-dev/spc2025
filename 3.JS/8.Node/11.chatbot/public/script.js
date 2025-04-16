function loading() {
  const chatbotIcon = document.getElementById('chatbotIcon');
  const closeButton = document.getElementById('closeChatbot');
  const chatBotWindow = document.getElementById('chatbotWindow');
  const sendButton = document.getElementById('sendMessage');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotMessages = document.getElementById('chatbotMessages');

  chatbotIcon.addEventListener('click', function () {
    chatBotWindow.style.display = 'flex';
    chatbotIcon.style.display = 'none';
  });

  closeButton.addEventListener('click', function () {
    chatBotWindow.style.display = 'none';
    chatbotIcon.style.display = 'flex';
  });

  chatbotInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendButton.click();
    }
  });

  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    const iconElement = document.createElement('i');
    const textElement = document.createElement('span');

    messageElement.classList.add(
      sender === '나' ? 'message-user' : 'message-chatbot'
    );

    if (sender === '나') {
      iconElement.classList.add('bi', 'bi-person-fill');
    } else {
      iconElement.classList.add('bi', 'bi-robot');
    }

    textElement.textContent = message;

    messageElement.appendChild(iconElement);
    messageElement.appendChild(textElement);
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  sendButton.addEventListener('click', function () {
    const userInput = chatbotInput.value;
    if (!userInput.trim()) return;

    appendMessage(userInput, '나');

    chatbotInput.value = '';

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userInput }),
    })
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then((errData) => {
              throw new Error(
                errData.answer || `으아 에러 발생! status: ${response.status}`
              );
            })
            .catch(() => {
              throw new Error(`으아 에러 발생! status: ${response.status}`);
            });
        }
        return response.json();
      })
      .then((data) => {
        appendMessage(data.answer, '챗봇');
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        appendMessage('서버와 연결할 수 없습니다.', '챗봇');
      });
  });
}

document.addEventListener('DOMContentLoaded', loading);
