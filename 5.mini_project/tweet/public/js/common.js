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

function updateNavbar(loginStatus) {
  const navUl = document.querySelector('nav ul');
  if (!navUl) return;

  const loginLink = navUl.querySelector('a[href="login.html"]');
  const logoutLink = navUl.querySelector('#logout-link'); // Logout 링크 선택
  const profileLink = navUl.querySelector('a[href="profile.html"]');
  const tweetLink = navUl.querySelector('a[href="tweet.html"]');

  if (loginStatus.loggedIn) {
    if (loginLink) loginLink.parentElement.style.display = 'none'; // 로그인 숨김
    if (logoutLink) logoutLink.parentElement.style.display = 'inline-block'; // 로그아웃 표시
    if (profileLink) profileLink.parentElement.style.display = 'inline-block'; // 프로필 표시
    if (tweetLink) tweetLink.parentElement.style.display = 'inline-block'; // 트윗 작성 표시

    // 로그아웃 링크 이벤트 리스너 추가 (한 번만 추가되도록 확인)
    if (logoutLink && !logoutLink.dataset.listenerAttached) {
      logoutLink.addEventListener('click', handleLogout);
      logoutLink.dataset.listenerAttached = 'true'; // 리스너 추가됨 표시
    }
  } else {
    if (loginLink) loginLink.parentElement.style.display = 'inline-block'; // 로그인 표시
    if (logoutLink) logoutLink.parentElement.style.display = 'none'; // 로그아웃 숨김
    if (profileLink) profileLink.parentElement.style.display = 'none'; // 프로필 숨김
    if (tweetLink) tweetLink.parentElement.style.display = 'none'; // 트윗 작성 숨김
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

// DOM 로드 시 로그인 상태 확인 및 네비게이션 업데이트
document.addEventListener('DOMContentLoaded', async () => {
  const loginStatus = await checkLoginStatus();
  updateNavbar(loginStatus);
});
