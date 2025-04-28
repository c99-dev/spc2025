const tweetForm = document.querySelector('#tweet-form');
const tweetInput = document.querySelector('#content');
const flashMessageDiv = document.querySelector('#flash-message');

tweetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  flashMessageDiv.textContent = '';
  flashMessageDiv.classList.remove('error', 'success');

  const content = tweetInput.value.trim(); // 공백 제거

  if (!content) {
    flashMessageDiv.textContent = '트윗 내용을 입력해주세요.';
    flashMessageDiv.classList.add('error');
    return; // 내용 없으면 전송 중단
  }

  try {
    const response = await fetch('/api/tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content }), // 변수명 사용
    });

    if (response.ok) {
      const result = await response.json();
      console.log('트윗 게시됨:', result);
      // 성공 메시지 표시 (선택 사항)
      // flashMessageDiv.textContent = '트윗이 성공적으로 게시되었습니다!';
      // flashMessageDiv.classList.add('success');
      // alert('트윗이 성공적으로 게시되었습니다!'); // alert 대신 홈으로 바로 이동
      window.location.href = '/'; // 성공 시 홈으로 리디렉션
    } else if (response.status === 401) {
      // 로그인이 필요한 경우
      flashMessageDiv.textContent = '트윗을 작성하려면 로그인이 필요합니다.';
      flashMessageDiv.classList.add('error');
      // 약간의 지연 후 리디렉션
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' })); // JSON 파싱 오류 처리
      console.error('Failed to post tweet:', errorData.message);
      flashMessageDiv.textContent = `트윗 게시에 실패했습니다: ${
        errorData.message || response.statusText
      }`;
      flashMessageDiv.classList.add('error');
    }
  } catch (error) {
    console.error('트윗 게시 중 오류 발생:', error);
    flashMessageDiv.textContent =
      '트윗 게시 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    flashMessageDiv.classList.add('error');
  }
});
