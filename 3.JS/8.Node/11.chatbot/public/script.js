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
    messageElement.textContent = sender + ': ' + message;
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  sendButton.addEventListener('click', function () {
    appendMessage(chatbotInput.value, '나');

    const userInput = chatbotInput.value;
    chatbotInput.value = '';

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userInput }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        appendMessage(data.answer, '챗봇');
      });
  });
}

document.addEventListener('DOMContentLoaded', loading);
