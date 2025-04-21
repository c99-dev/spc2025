async function loading() {
  const chatbotIcon = document.querySelector('#chatbotIcon');
  const closeButton = document.querySelector('#closeChatbot');
  const chatBotWindow = document.querySelector('#chatbotWindow');
  const sendButton = document.querySelector('#sendMessage');
  const chatbotInput = document.querySelector('#chatbotInput');
  const chatbotMessages = document.querySelector('#chatbotMessages');
  const movieTable = document.querySelector('#movie-table');
  const tbody = movieTable.querySelector('tbody');

  let previousHighlightedRow = null;

  function showChatbot() {
    chatBotWindow.style.display = 'flex';
    chatbotIcon.style.display = 'none';
  }

  function hideChatbot() {
    chatBotWindow.style.display = 'none';
    chatbotIcon.style.display = 'flex';
  }

  function handleEnterKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendButton.click();
    }
  }

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

  function highlightMovieByRank(rank) {
    if (previousHighlightedRow) {
      previousHighlightedRow.style.backgroundColor = '';
    }

    const allRows = tbody.querySelectorAll('tr');
    for (const row of allRows) {
      const rankCell = row.querySelector('.rank');
      if (rankCell && rankCell.textContent === String(rank)) {
        row.style.backgroundColor = '#fff3cd';

        row.scrollIntoView({ behavior: 'smooth', block: 'center' });

        previousHighlightedRow = row;
      }
    }
  }

  function sendMessage() {
    const userInput = chatbotInput.value;
    if (!userInput.trim()) return;
    sendButton.disabled = true;
    appendMessage(userInput, '나');
    chatbotInput.value = '';
    fetchChatbotResponse(userInput);
  }

  async function fetchChatbotResponse(userInput) {
    try {
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      appendMessage(data.answer, '챗봇');

      if (data.rank !== undefined) {
        highlightMovieByRank(data.rank);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      appendMessage('서버와 연결할 수 없습니다.', '챗봇');
    } finally {
      sendButton.disabled = false;
    }
  }

  async function fetchMoviesJson() {
    const response = await fetch('http://localhost:5000/static/movies.json');
    return await response.json();
  }

  function createMovieImageUrl(title) {
    const baseUrl = 'http://localhost:5000/static/images/';
    const imgFileName = title.replace(/[\\/*?:"<>|. ]+/g, '_') + '.jpg';
    return baseUrl + imgFileName;
  }

  function createMovieRow(movie) {
    const tr = document.createElement('tr');
    const imgUrl = createMovieImageUrl(movie.title);

    tr.innerHTML = `
      <td class="rank">${movie.rank}</td>
        <td class="thumbnail">
          <img src="${imgUrl}" />
        </td>
        <td>
          <strong class="title">${movie.title}</strong>
          <br />
          <div class="synopsis">
            ${movie.synopsis}
          </div>
        </td>
    `;
    return tr;
  }

  async function createMovieRows() {
    const movies = await fetchMoviesJson();

    movies.forEach((movie) => {
      const row = createMovieRow(movie);
      tbody.appendChild(row);
    });
  }

  createMovieRows();

  chatbotIcon.addEventListener('click', showChatbot);
  closeButton.addEventListener('click', hideChatbot);
  chatbotInput.addEventListener('keypress', handleEnterKey);
  sendButton.addEventListener('click', sendMessage);
}

document.addEventListener('DOMContentLoaded', loading);
