/* filepath: c:\src\spc2025\3.JS\9.Project\4.session_cart\public\js\cart.js */
const cartBody = document.getElementById('cart-body');
const userInfoDiv = document.getElementById('user-info'); // 헤더 사용자 정보 div
const cartTotalElement = document.getElementById('cart-total'); // 총 합계 표시 요소

// 금액을 한국어 형식으로 포맷팅하는 함수
function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// 장바구니의 총 합계를 계산하고 표시하는 함수
function calculateCartTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  cartTotalElement.textContent = formatPrice(total);
  return total;
}

async function loadUserInfo() {
  // 사용자 정보 로드 함수
  try {
    const response = await fetch('/user');
    if (!response.ok) {
      if (response.status === 401) {
        // 로그인되지 않았으면 로그인 페이지로 리디렉션
        alert('로그인이 필요합니다.');
        location.href = '/login.html';
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: '알 수 없는 오류' }));
        alert(`사용자 정보 로딩 실패: ${errorData.message}`);
        userInfoDiv.textContent = '오류';
      }
      return null; // 사용자 정보 로드 실패
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
          location.href = '/'; // 로그아웃 후 홈으로 이동
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          alert('로그아웃 중 오류가 발생했습니다.');
        }
      });
    }
    return userData; // 성공 시 사용자 데이터 반환
  } catch (error) {
    console.error('사용자 정보 로딩 중 오류:', error);
    alert('사용자 정보 로딩 중 오류가 발생했습니다.');
    userInfoDiv.textContent = '오류';
    return null;
  }
}

// 장바구니 상품 수량 업데이트 함수
async function updateCartItemQuantity(productId, newCount) {
  if (newCount < 1) {
    return; // 1 미만이면 업데이트하지 않음
  }
  try {
    const response = await fetch(`/cart/${productId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: newCount }),
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: '수량 업데이트 실패' }));
      throw new Error(errorData.message);
    }
    await loadCartItems(); // 성공 시 장바구니 다시 로드
  } catch (error) {
    console.error('수량 업데이트 중 오류:', error);
    alert(`수량 업데이트 중 오류 발생: ${error.message}`);
  }
}

// 장바구니 상품 삭제 함수
async function deleteCartItem(productId) {
  if (!confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?')) {
    return; // 사용자가 취소하면 함수 종료
  }
  try {
    const response = await fetch(`/cart/${productId}/delete`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: '상품 삭제 실패' }));
      throw new Error(errorData.message);
    }
    await loadCartItems(); // 성공 시 장바구니 다시 로드
  } catch (error) {
    console.error('상품 삭제 중 오류 발생:', error);
    alert(`상품 삭제 중 오류 발생: ${error.message}`);
  }
}

async function loadCartItems() {
  // 장바구니 목록 로드 함수
  try {
    const response = await fetch('/cart-list');
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: '장바구니 목록 로딩 실패' }));
      throw new Error(errorData.message);
    }
    const data = await response.json();
    if (data.length === 0) {
      cartBody.innerHTML =
        '<tr><td colspan="6" class="text-center">장바구니가 비어 있습니다.</td></tr>'; // colspan 6으로 수정
      calculateCartTotal([]); // 빈 장바구니일 경우 총액은 0
    } else {
      cartBody.innerHTML = data
        .map((item) => {
          const itemTotal = item.price * item.count;
          return `<tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${formatPrice(item.price)}</td>
              <td>
                <button class="quantity-btn decrease-btn" data-id="${
                  item.id
                }" data-count="${item.count}">-</button>
                <span class="item-count">${item.count}</span>
                <button class="quantity-btn increase-btn" data-id="${
                  item.id
                }" data-count="${item.count}">+</button>
              </td>
              <td class="item-total">${formatPrice(itemTotal)}</td>
              <td>
                <button class="delete-btn" data-id="${item.id}">삭제</button>
              </td>
            </tr>`;
        })
        .join('');

      // 총 합계 계산 및 표시
      calculateCartTotal(data);

      // 수량 조절 버튼 이벤트 리스너 추가
      document.querySelectorAll('.quantity-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
          const productId = event.target.dataset.id;
          let currentCount = parseInt(event.target.dataset.count);
          if (event.target.classList.contains('increase-btn')) {
            updateCartItemQuantity(productId, currentCount + 1);
          } else if (event.target.classList.contains('decrease-btn')) {
            updateCartItemQuantity(productId, currentCount - 1);
          }
        });
      });

      // 삭제 버튼 이벤트 리스너 추가
      document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
          const productId = event.target.dataset.id;
          deleteCartItem(productId);
        });
      });
    }
  } catch (error) {
    console.error('장바구니 목록 로딩 중 오류:', error);
    cartBody.innerHTML = `<tr><td colspan="6" class="text-center">장바구니를 불러오는 중 오류 발생: ${error.message}</td></tr>`; // colspan 6으로 수정
  }
}

async function initializePage() {
  const user = await loadUserInfo(); // 사용자 정보 먼저 로드 및 확인
  if (user) {
    // 사용자가 성공적으로 로드된 경우에만 장바구니 로드
    await loadCartItems();
  }
}

document.addEventListener('DOMContentLoaded', initializePage);
