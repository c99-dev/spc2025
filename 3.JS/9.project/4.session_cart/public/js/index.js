/* filepath: c:\src\spc2025\3.JS\9.Project\4.session_cart\public\js\index.js */
const userInfoDiv = document.getElementById('user-info');
const welcomeMessage = document.getElementById('welcome-message');

async function loading() {
  try {
    const response = await fetch('/user');
    if (!response.ok) {
      if (response.status === 401) {
        // 로그인 안됨: login.html로 리디렉션
        location.href = '/login.html';
      } else {
        // 기타 오류 처리
        const errorData = await response.json();
        console.error('사용자 정보 로딩 실패:', errorData.message);
        userInfoDiv.innerHTML = '오류';
        welcomeMessage.textContent = '사용자 정보를 불러오는데 실패했습니다.';
      }
      return;
    }

    // 로그인 됨: 환영 메시지 표시
    const data = await response.json();
    userInfoDiv.innerHTML = `
          <span>${data.name}님</span>
          <a href="#" id="logout-link">로그아웃</a>
        `;
    welcomeMessage.textContent = `환영합니다, ${data.name}님!`;

    // 로그아웃 링크 이벤트 리스너 추가
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          const logoutResponse = await fetch('/logout');
          const logoutData = await logoutResponse.json();
          alert(logoutData.message);
          location.href = '/';
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          alert('로그아웃 중 오류가 발생했습니다.');
        }
      });
    }
  } catch (error) {
    console.error('페이지 로딩 중 오류 발생:', error);
    userInfoDiv.innerHTML = '오류';
    welcomeMessage.textContent = '페이지 로딩 중 오류가 발생했습니다.';
  }
}

document.addEventListener('DOMContentLoaded', loading);
