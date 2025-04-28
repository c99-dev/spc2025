async function checkLoginStatus() {
  try {
    const response = await fetch('/api/check-login');
    if (!response.ok) {
      console.error('로그인 상태 확인 실패:', response.statusText);
      return { loggedIn: false };
    }
    return await response.json();
  } catch (error) {
    console.error('로그인 상태 확인 중 오류:', error);
    return { loggedIn: false };
  }
}

async function handleLogout(event) {
  event.preventDefault(); // 링크 기본 동작 방지
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      console.log('로그아웃 성공');
      window.location.href = '/login.html'; // 로그아웃 후 로그인 페이지로 이동
    } else {
      console.error('로그아웃 실패:', await response.json());
      alert('로그아웃에 실패했습니다.');
    }
  } catch (error) {
    console.error('로그아웃 요청 중 오류:', error);
    alert('로그아웃 중 오류가 발생했습니다.');
  }
}

function renderNavbar(loginStatus) {
  const nav = document.querySelector('nav');
  const ul = document.createElement('ul');

  // 항상 표시되는 링크
  ul.innerHTML = `<li><a href="index.html">Home</a></li>`;

  if (loginStatus.loggedIn) {
    // 로그인 상태일 때 표시되는 링크
    ul.innerHTML += `
      <li><a href="#" id="logout-link">Logout</a></li>
      <li><a href="profile.html">Profile</a></li>
      <li><a href="tweet.html">Tweet</a></li>
    `;
  } else {
    // 로그아웃 상태일 때 표시되는 링크
    ul.innerHTML += `<li><a href="login.html">Login</a></li>`;
  }

  nav.appendChild(ul);

  // 로그아웃 링크 이벤트 리스너 추가 (로그인 상태일 때만)
  if (loginStatus.loggedIn) {
    const logoutLink = nav.querySelector('#logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', handleLogout);
    }
  }

  // body의 맨 앞에 네비게이션 바 추가
  document.body.prepend(nav);
}

// DOM 로드 시 로그인 상태 확인 및 네비게이션 생성
document.addEventListener('DOMContentLoaded', async () => {
  const loginStatus = await checkLoginStatus();
  renderNavbar(loginStatus);

  // 네비게이션 생성 후 페이지별 스크립트가 필요한 초기화 수행 가능
  // 예: index.js의 renderTweet는 네비게이션 생성 후에 호출되어야 함
  // 현재 구조에서는 common.js 다음에 각 페이지 js가 로드되므로 문제 없음
});
