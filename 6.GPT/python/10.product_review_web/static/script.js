document.addEventListener('DOMContentLoaded', function () {
  const reviewForm = document.querySelector('.review-form');
  const reviewsListContainer = document.querySelector('.reviews-list');
  const productNameInput = document.querySelector('input[name="product_name"]');
  const productName = productNameInput ? productNameInput.value : null;

  // 후기 폼 제출 처리
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (event) {
      event.preventDefault(); // 기본 폼 제출 방지

      const formData = new FormData(reviewForm);
      const submitButton = reviewForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            등록 중...
          `;
      // Flask의 url_for를 JavaScript에서 직접 사용할 수 없으므로,
      // 폼의 action 속성에 설정된 URL을 사용합니다.
      fetch(reviewForm.action, {
        // 수정된 부분
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            reviewForm.reset(); // 폼 초기화
            if (data.review) {
              addReviewToDOM(data.review, true);
            } else {
              if (productName) loadReviews(productName);
            }
            const noReviewsMessage = reviewsListContainer.querySelector(
              '.no-reviews-message'
            );
            if (noReviewsMessage) {
              noReviewsMessage.remove();
            }
          } else {
            alert('오류: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('후기 등록 중 오류가 발생했습니다.');
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        });
    });
  }

  // 특정 상품의 후기 목록을 불러와 DOM에 렌더링하는 함수
  function loadReviews(productNameForFetch) {
    if (!reviewsListContainer) return; // 후기 목록 컨테이너가 없으면 실행 중지
    fetch(`/get_reviews/${encodeURIComponent(productNameForFetch)}`)
      .then((response) => response.json())
      .then((reviews) => {
        renderReviews(reviews);
      })
      .catch((error) => {
        console.error('Error loading reviews:', error);
        reviewsListContainer.innerHTML =
          '<p class="text-red-500 text-center">후기를 불러오는 중 오류가 발생했습니다.</p>';
      });
  }

  // 후기 데이터를 받아 DOM에 렌더링하는 함수
  function renderReviews(reviews) {
    if (!reviewsListContainer) return;
    reviewsListContainer.innerHTML = ''; // 기존 목록 초기화
    if (reviews && reviews.length > 0) {
      reviews.forEach((review) => {
        addReviewToDOM(review);
      });
    } else {
      reviewsListContainer.innerHTML = `
              <p class="no-reviews-message text-slate-500 text-center py-10">
                아직 등록된 후기가 없습니다. 첫 후기를 작성해주세요!
              </p>`;
    }
  }

  // 단일 후기 객체를 받아 DOM 요소로 만들어 목록에 추가하는 함수
  function addReviewToDOM(review, prepend = false) {
    if (!reviewsListContainer) return;
    const reviewDate = new Date(review.created_at);
    const formattedDate = `${reviewDate.getFullYear()}년 ${String(
      reviewDate.getMonth() + 1
    ).padStart(2, '0')}월 ${String(reviewDate.getDate()).padStart(
      2,
      '0'
    )}일 ${String(reviewDate.getHours()).padStart(2, '0')}시 ${String(
      reviewDate.getMinutes()
    ).padStart(2, '0')}분`;

    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      starsHTML += `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                     class="w-5 h-5 ${
                       i <= review.rating ? 'text-yellow-400' : 'text-slate-300'
                     }">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.927c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>`;
    }

    const reviewElement = document.createElement('article');
    reviewElement.className =
      'review-item bg-white p-5 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200';
    reviewElement.innerHTML = `
              <header class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  ${starsHTML}
                  <span class="ml-2 text-sm font-medium text-indigo-600">(${review.rating}점)</span>
                </div>
                <div class="flex items-center">
                  <small class="text-xs text-slate-500 mr-3">${formattedDate}</small>
                  <button class="delete-review-btn text-xs text-red-500 hover:text-red-700" data-review-id="${review.id}">삭제</button>
                </div>
              </header>
              <p class="text-slate-700 leading-relaxed prose prose-sm max-w-none">${review.review_text}</p>
            `;

    // 삭제 버튼 이벤트 리스너 추가
    const deleteButton = reviewElement.querySelector('.delete-review-btn');
    if (deleteButton) {
      deleteButton.addEventListener('click', function () {
        const reviewId = this.dataset.reviewId;
        if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
          fetch(`/delete_review/${reviewId}`, {
            method: 'DELETE',
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                reviewElement.remove(); // DOM에서 리뷰 아이템 제거
                // 만약 삭제 후 리뷰가 하나도 없다면 "아직 등록된 후기가 없습니다" 메시지 표시
                if (reviewsListContainer.children.length === 0) {
                  reviewsListContainer.innerHTML = `
                    <p class="no-reviews-message text-slate-500 text-center py-10">
                      아직 등록된 후기가 없습니다. 첫 후기를 작성해주세요!
                    </p>`;
                }
              } else {
                alert('오류: ' + data.message);
              }
            })
            .catch((error) => {
              console.error('Error deleting review:', error);
              alert('리뷰 삭제 중 오류가 발생했습니다.');
            });
        }
      });
    }

    const noReviewsMessage = reviewsListContainer.querySelector(
      '.no-reviews-message'
    );
    if (noReviewsMessage) {
      noReviewsMessage.remove();
    }

    if (prepend) {
      reviewsListContainer.prepend(reviewElement);
    } else {
      reviewsListContainer.appendChild(reviewElement);
    }
  }
  // 초기 후기 로딩은 서버 사이드에서 이미 처리되므로, 클라이언트 사이드에서 중복 로드할 필요가 없습니다.
  // 만약 초기 로딩도 JS로 하고 싶다면, Jinja 템플릿의 reviews 반복 부분을 비워두고 아래 주석을 해제합니다.
  // if (productName) {
  //   loadReviews(productName);
  // }

  // 초기 로드된 리뷰들에 대해서도 삭제 버튼 이벤트 리스너를 연결합니다.
  document.querySelectorAll('.delete-review-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const reviewId = this.dataset.reviewId;
      const reviewElement = this.closest('.review-item'); // 삭제할 DOM 요소

      if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
        fetch(`/delete_review/${reviewId}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              if (reviewElement) reviewElement.remove();
              if (reviewsListContainer.children.length === 0) {
                reviewsListContainer.innerHTML = `
                  <p class="no-reviews-message text-slate-500 text-center py-10">
                    아직 등록된 후기가 없습니다. 첫 후기를 작성해주세요!
                  </p>`;
              }
            } else {
              alert('오류: ' + data.message);
            }
          })
          .catch((error) => {
            console.error('Error deleting review:', error);
            alert('리뷰 삭제 중 오류가 발생했습니다.');
          });
      }
    });
  });
});
