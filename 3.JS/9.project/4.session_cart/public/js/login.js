/* filepath: c:\src\spc2025\3.JS\9.Project\4.session_cart\public\js\login.js */
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });
    const data = await response.json();
    alert(data.message);
    if (response.ok) {
      // 로그인 성공 시 홈으로 이동
      location.href = '/';
    } else {
      // 실패 시 비밀번호 필드만 초기화
      const passwordInput = document.getElementById('password');
      if (passwordInput) passwordInput.value = '';
    }
  } catch (error) {
    console.error('로그인 요청 중 오류:', error);
    alert('로그인 처리 중 오류가 발생했습니다.');
  }
});
