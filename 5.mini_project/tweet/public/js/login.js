const loginForm = document.querySelector('#login-form'); // form 요소 선택
const flashMessageDiv = document.querySelector('#flash-message');

loginForm.addEventListener('submit', async (event) => {
  // submit 이벤트 리스너로 변경
  event.preventDefault(); // 폼 기본 제출 동작 방지

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  flashMessageDiv.textContent = ''; // 이전 메시지 초기화
  flashMessageDiv.classList.remove('error', 'success'); // 스타일 클래스 초기화

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      console.log('로그인 성공:', user);
      // 성공 메시지 표시 (선택 사항)
      // flashMessageDiv.textContent = '로그인 성공!';
      // flashMessageDiv.classList.add('success');
      window.location.href = '/'; // 홈으로 리디렉션
    } else {
      const errorData = await response.json();
      console.error('로그인 실패:', errorData.message);
      flashMessageDiv.textContent = `로그인 실패: ${
        errorData.message || '이메일 또는 비밀번호를 확인하세요.'
      }`;
      flashMessageDiv.classList.add('error');
    }
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    flashMessageDiv.textContent =
      '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    flashMessageDiv.classList.add('error');
  }
});
