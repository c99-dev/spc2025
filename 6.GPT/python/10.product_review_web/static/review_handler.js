// 이 파일은 uiHandler.js의 hardcodedUiStrings와 localeMap을 사용할 수 있다고 가정합니다.
// 실제로는 script.js를 통해 uiHandler 객체를 전달받아야 합니다.

const translationCache = {}; // 번역 캐시 객체

// 단일 리뷰 또는 텍스트 번역 함수
function translateSingleReview(element, text, targetLang, currentUiStrings) {
  const cacheKey = `${targetLang}_${text}`;
  if (translationCache[cacheKey]) {
    element.textContent = translationCache[cacheKey];
    return;
  }

  element.textContent = currentUiStrings.translating_review;
  fetch('/translate_review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text, target_lang: targetLang }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        element.textContent = data.translated_text;
        translationCache[cacheKey] = data.translated_text;
      } else {
        element.textContent =
          data.message || currentUiStrings.translation_failed || '번역 실패';
        console.error('Translation error:', data.message);
      }
    })
    .catch((error) => {
      element.textContent =
        currentUiStrings.translation_error_request || '번역 요청 오류';
      console.error('Error fetching translation:', error);
    });
}

// 단일 후기 객체를 받아 DOM 요소로 만들어 목록에 추가하는 함수
function addReviewToDOM(
  review,
  prepend = false,
  reviewsListContainerElement,
  currentLocale,
  currentUiStrings,
  aiSummaryParagraphElement
) {
  if (!reviewsListContainerElement) return null;
  const reviewDate = new Date(review.created_at);
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const displayLocale = window.uiHandler.localeMap[currentLocale] || 'ko-KR'; // uiHandler에서 localeMap 접근
  const formattedDate = reviewDate.toLocaleString(displayLocale, dateOptions);

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
              <small class="review-date text-xs text-slate-500 mr-3" data-timestamp="${review.created_at}">${formattedDate}</small>
              <button class="delete-review-btn text-xs text-red-500 hover:text-red-700" data-review-id="${review.id}">삭제</button>
            </div>
          </header>
          <p class="review-text-display text-slate-700 leading-relaxed prose prose-sm max-w-none" data-original-text="${review.review_text}">${review.review_text}</p>
        `;

  const deleteButton = reviewElement.querySelector('.delete-review-btn');
  if (deleteButton) {
    // 이벤트 리스너는 event_listeners.js에서 일괄적으로 추가하도록 변경 고려
    // 여기서는 일단 유지하되, script.js에서 호출 시 uiStrings 등을 넘겨받도록 수정
    deleteButton.addEventListener('click', function () {
      const reviewId = this.dataset.reviewId;
      if (confirm(currentUiStrings.confirm_delete_review)) {
        fetch(`/delete_review/${reviewId}?current_language=${currentLocale}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              reviewElement.remove();
              if (data.ai_summary && aiSummaryParagraphElement) {
                aiSummaryParagraphElement.textContent = data.ai_summary;
                aiSummaryParagraphElement.dataset.originalText =
                  data.ai_summary; // 원본도 업데이트
              }
              if (reviewsListContainerElement.children.length === 0) {
                reviewsListContainerElement.innerHTML = `<p class="no-reviews-message text-slate-500 text-center py-10">${currentUiStrings.no_reviews_yet}</p>`;
              }
            } else {
              alert(
                (currentUiStrings.error_alert_prefix || '오류: ') + data.message
              );
            }
          })
          .catch((error) => {
            console.error('Error deleting review:', error);
            alert(
              currentUiStrings.error_deleting_review ||
                '리뷰 삭제 중 오류가 발생했습니다.'
            );
          });
      }
    });
  }

  const noReviewsMessage = reviewsListContainerElement.querySelector(
    '.no-reviews-message'
  );
  if (noReviewsMessage) {
    noReviewsMessage.remove();
  }

  if (prepend) {
    reviewsListContainerElement.prepend(reviewElement);
  } else {
    reviewsListContainerElement.appendChild(reviewElement);
  }
  return reviewElement;
}

// 특정 상품의 후기 목록을 불러와 DOM에 렌더링하는 함수
function loadReviews(
  productNameForFetch,
  reviewsListContainerElement,
  currentUiStrings,
  addReviewToDOMFunc
) {
  if (!reviewsListContainerElement) return;
  fetch(`/get_reviews/${encodeURIComponent(productNameForFetch)}`)
    .then((response) => response.json())
    .then((reviews) => {
      renderReviews(
        reviews,
        reviewsListContainerElement,
        currentUiStrings,
        addReviewToDOMFunc
      );
    })
    .catch((error) => {
      console.error('Error loading reviews:', error);
      reviewsListContainerElement.innerHTML = `<p class="text-red-500 text-center">${
        currentUiStrings.error_loading_reviews ||
        '후기를 불러오는 중 오류가 발생했습니다.'
      }</p>`;
    });
}

// 후기 데이터를 받아 DOM에 렌더링하는 함수
function renderReviews(
  reviews,
  reviewsListContainerElement,
  currentUiStrings,
  addReviewToDOMFunc
) {
  if (!reviewsListContainerElement) return;
  reviewsListContainerElement.innerHTML = '';
  if (reviews && reviews.length > 0) {
    reviews.forEach((review) => {
      // addReviewToDOMFunc 호출 시 필요한 모든 인자 전달
      addReviewToDOMFunc(
        review,
        false,
        reviewsListContainerElement,
        window.currentLocale,
        currentUiStrings,
        document.querySelector('.ai-summary-text')
      );
    });
  } else {
    reviewsListContainerElement.innerHTML = `<p class="no-reviews-message text-slate-500 text-center py-10">${currentUiStrings.no_reviews_yet}</p>`;
  }
}

// 전역으로 export
window.reviewHandler = {
  translateSingleReview,
  addReviewToDOM,
  loadReviews,
  renderReviews,
  translationCache, // 캐시도 공유 가능
};
