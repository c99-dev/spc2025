const profileForm = document.querySelector('#profile-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const flashMessageDiv = document.querySelector('#flash-message');

async function fetchProfile() {
  try {
    const response = await fetch('/api/profile'); // 사용자 프로필 정보 API 엔드포인트 (가정)
    if (response.ok) {
      const user = await response.json();
      usernameInput.value = user.username; // 사용자명 필드 채우기
    } else if (response.status === 401) {
      // 로그인이 필요한 경우 로그인 페이지로 리디렉션
      window.location.href = '/login.html';
    } else {
      console.error('프로필 정보 로드 실패:', response.statusText);
      flashMessageDiv.textContent = '프로필 정보를 불러오는데 실패했습니다.';
      flashMessageDiv.classList.add('error');
    }
  } catch (error) {
    console.error('프로필 정보 로드 중 오류 발생:', error);
    flashMessageDiv.textContent = '프로필 정보 로드 중 오류가 발생했습니다.';
    flashMessageDiv.classList.add('error');
  }
}

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  flashMessageDiv.textContent = '';
  flashMessageDiv.classList.remove('error', 'success');

  const username = usernameInput.value;
  const password = passwordInput.value;

  const updateData = { username };
  if (password) {
    // 비밀번호 필드가 비어있지 않으면 업데이트 데이터에 포함
    updateData.password = password;
  }

  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('프로필 업데이트 성공:', result);
      flashMessageDiv.textContent = '프로필이 성공적으로 업데이트되었습니다.';
      flashMessageDiv.classList.add('success');
      passwordInput.value = ''; // 성공 후 비밀번호 필드 초기화
    } else if (response.status === 401) {
      // 로그인이 필요한 경우 로그인 페이지로 리디렉션
      flashMessageDiv.textContent = '프로필을 수정하려면 로그인이 필요합니다.';
      flashMessageDiv.classList.add('error');
      // 약간의 지연 후 리디렉션 (메시지 확인 시간)
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: '알 수 없는 오류' })); // JSON 파싱 오류 처리 추가
      console.error('프로필 업데이트 실패:', errorData.message);
      flashMessageDiv.textContent = `프로필 업데이트 실패: ${
        errorData.message || '입력 내용을 확인하세요.'
      }`;
      flashMessageDiv.classList.add('error');
    }
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    flashMessageDiv.textContent = '프로필 업데이트 중 오류가 발생했습니다.';
    flashMessageDiv.classList.add('error');
  }
});

// 페이지 로드 시 프로필 정보 가져오기
// common.js에서 네비게이션 업데이트 후 프로필 정보 로드
document.addEventListener('DOMContentLoaded', fetchProfile);
