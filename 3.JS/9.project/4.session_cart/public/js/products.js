/* filepath: c:\src\spc2025\3.JS\9.Project\4.session_cart\public\js\products.js */
const productList = document.getElementById('product-list');
const userInfoDiv = document.getElementById('user-info'); // 헤더 사용자 정보 div
const toastContainer = document.getElementById('toast-container'); // 토스트 컨테이너

// 토스트 메시지 표시 함수
function showToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // 약간의 딜레이 후 'show' 클래스 추가하여 페이드인 효과 적용
  setTimeout(() => {
    toast.classList.add('show');
  }, 10); // 10ms 딜레이

  // 3초 후 토스트 메시지 제거 (페이드아웃 효과 포함)
  setTimeout(() => {
    toast.classList.remove('show');
    // 트랜지션 완료 후 DOM에서 제거
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode === toastContainer) {
        toastContainer.removeChild(toast);
      }
    });
    // 만약 transitionend 이벤트가 발생하지 않을 경우를 대비해 일정 시간 후 강제 제거
    setTimeout(() => {
      if (toast.parentNode === toastContainer) {
        toastContainer.removeChild(toast);
      }
    }, 500); // 0.5초 (transition 시간과 동일하게 설정)
  }, 3000); // 3초 동안 표시
}

async function loadUserInfo() {
  // 사용자 정보 로드 함수 분리
  try {
    const response = await fetch('/user');
    if (!response.ok) {
      if (response.status === 401) {
        userInfoDiv.innerHTML = '<a href="/login.html">로그인</a>';
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: '알 수 없는 오류' }));
        console.error('사용자 정보 로딩 실패:', errorData.message);
        userInfoDiv.textContent = '오류';
      }
      return null; // 사용자 정보 로드 실패 시 null 반환
    }
    const userData = await response.json();
    // 헤더에 사용자 이름과 로그아웃 링크 추가
    userInfoDiv.innerHTML = `
          <span>${userData.name}님</span>
          <a href="#" id="logout-link">로그아웃</a>
        `;

    // 로그아웃 링크 이벤트 리스너 추가
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          const logoutResponse = await fetch('/logout');
          const logoutData = await logoutResponse.json();
          alert(logoutData.message);
          location.href = '/'; // 로그아웃 후 홈으로 이동 또는 로그인 페이지로 이동
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          alert('로그아웃 중 오류가 발생했습니다.');
        }
      });
    }
    return userData; // 성공 시 사용자 데이터 반환
  } catch (error) {
    console.error('사용자 정보 로딩 중 오류:', error);
    userInfoDiv.textContent = '오류';
    return null;
  }
}

async function loadProducts() {
  // 제품 목록 로드 함수
  try {
    const response = await fetch('/products-list');
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: '제품 목록 로딩 실패' }));
      throw new Error(errorData.message);
    }
    const data = await response.json();
    if (data.length === 0) {
      productList.innerHTML = `<p>표시할 제품이 없습니다.</p>`; // 카드 컨테이너에 메시지 표시
      return;
    }
    productList.innerHTML = data // 카드 컨테이너 내용을 채움
      .map(
        (item) =>
          `<div class="product-card">
              <h3>${item.name}</h3>
              <p>${item.price}원</p>
              <button class="add-to-cart" product-id="${item.id}">장바구니에 추가</button>
            </div>`
      )
      .join('');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('product-id');
        fetch(`/products/${productId}/cart`, { method: 'POST' })
          .then((response) => {
            if (response.status === 401) {
              alert('로그인 후 장바구니에 추가할 수 있습니다.'); // alert 다시 추가
              window.location.href = '/login.html'; // 로그인 페이지로 리디렉션
              return Promise.reject('로그인 필요');
            }
            if (!response.ok) {
              return response
                .json()
                .then((errData) => {
                  throw new Error(
                    errData.message || `오류 (${response.status})`
                  );
                })
                .catch(() => {
                  throw new Error(`서버 오류 (${response.status})`);
                });
            }
            return response.json();
          })
          .then((data) => {
            if (data && data.message) {
              showToast(data.message);
            }
          })
          .catch((error) => {
            if (
              error !== '로그인 필요' &&
              !(error instanceof Error && error.message.includes('로그인 필요'))
            ) {
              console.error('장바구니 추가 중 에러:', error);
              const errorMessage = `장바구니 추가 실패: ${
                error instanceof Error ? error.message : error
              }`;
              showToast(errorMessage);
            }
          });
      });
    });
  } catch (error) {
    console.error('제품 목록 로딩 중 오류:', error);
    const errorMessage = `제품 목록 로딩 오류: ${error.message}`;
    showToast(errorMessage); // 오류 발생 시 토스트 메시지 표시
    productList.innerHTML = `<p>제품 목록을 불러오는 중 오류가 발생했습니다.</p>`; // 사용자에게는 간단한 메시지 표시
  }
}

async function initializePage() {
  await loadUserInfo(); // 사용자 정보 먼저 로드
  await loadProducts(); // 그 다음 제품 목록 로드
}

document.addEventListener('DOMContentLoaded', initializePage);
