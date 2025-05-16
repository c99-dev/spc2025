// 이 파일은 uiHandler.js와 reviewHandler.js의 함수 및 변수를 사용할 수 있다고 가정합니다.
// 실제로는 script.js를 통해 필요한 객체들을 전달받아야 합니다.

function initializeEventListeners(
  currentLocaleRef,
  uiStringsRef,
  elements,
  handlers
) {
  const {
    reviewForm,
    reviewsListContainer,
    productName,
    aiSummaryParagraph,
    languageSelect,
  } = elements;
  const { ui, review } = handlers;

  // 후기 폼 제출 처리
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(reviewForm);
      formData.append('current_language', currentLocaleRef.value);

      const submitButton = reviewForm.querySelector('button[type="submit"]');
      const originalButtonSpan = submitButton.querySelector(
        'span[data-translate-key="submit_review_button"]'
      );
      const originalButtonText = originalButtonSpan
        ? originalButtonSpan.textContent
        : submitButton.textContent;

      submitButton.disabled = true;
      const submittingText =
        uiStringsRef.value.submitting_review_button || '등록 중...';
      if (originalButtonSpan) originalButtonSpan.textContent = submittingText;
      else
        submitButton.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>${submittingText}`;

      fetch(reviewForm.action, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            reviewForm.reset();
            if (data.review) {
              const newReviewElement = review.addReviewToDOM(
                data.review,
                true,
                reviewsListContainer,
                currentLocaleRef.value,
                uiStringsRef.value,
                aiSummaryParagraph
              );
              if (languageSelect.value !== 'ko' && newReviewElement) {
                const reviewTextElement = newReviewElement.querySelector(
                  '.review-text-display'
                );
                const originalText = reviewTextElement.dataset.originalText;
                review.translateSingleReview(
                  reviewTextElement,
                  originalText,
                  languageSelect.value,
                  uiStringsRef.value
                );
              }
            }
            if (data.ai_summary) {
              if (aiSummaryParagraph) {
                aiSummaryParagraph.textContent = data.ai_summary;
                aiSummaryParagraph.dataset.originalText = data.ai_summary; // 원본도 업데이트
              }
            }
            const noReviewsMessage = reviewsListContainer.querySelector(
              '.no-reviews-message'
            );
            if (noReviewsMessage) noReviewsMessage.remove();
          } else {
            alert(
              (uiStringsRef.value.error_alert_prefix || '오류: ') + data.message
            );
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(
            uiStringsRef.value.error_submitting_review ||
              '후기 등록 중 오류가 발생했습니다.'
          );
        })
        .finally(() => {
          submitButton.disabled = false;
          if (originalButtonSpan)
            originalButtonSpan.textContent = originalButtonText;
          else
            submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 h-5 w-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg> ${originalButtonText}`;
        });
    });
  }

  // 초기 로드된 리뷰들에 대한 삭제 버튼 이벤트 리스너 및 날짜 포맷팅
  document.querySelectorAll('.review-item').forEach((reviewElement) => {
    const deleteButton = reviewElement.querySelector('.delete-review-btn');
    if (deleteButton) {
      deleteButton.addEventListener('click', function () {
        const reviewId = this.dataset.reviewId;
        const closestReviewElement = this.closest('.review-item');
        if (confirm(uiStringsRef.value.confirm_delete_review)) {
          fetch(
            `/delete_review/${reviewId}?current_language=${currentLocaleRef.value}`,
            {
              method: 'DELETE',
            }
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                if (closestReviewElement) closestReviewElement.remove();
                if (data.ai_summary && aiSummaryParagraph) {
                  aiSummaryParagraph.textContent = data.ai_summary;
                  aiSummaryParagraph.dataset.originalText = data.ai_summary;
                }
                if (reviewsListContainer.children.length === 0) {
                  reviewsListContainer.innerHTML = `<p class="no-reviews-message text-slate-500 text-center py-10">${uiStringsRef.value.no_reviews_yet}</p>`;
                }
              } else {
                alert(
                  (uiStringsRef.value.error_alert_prefix || '오류: ') +
                    data.message
                );
              }
            })
            .catch((error) => {
              console.error('Error deleting review:', error);
              alert(
                uiStringsRef.value.error_deleting_review ||
                  '리뷰 삭제 중 오류가 발생했습니다.'
              );
            });
        }
      });
    }
    const dateElement = reviewElement.querySelector('.review-date');
    if (dateElement && dateElement.dataset.timestamp) {
      const reviewTimestamp = dateElement.dataset.timestamp;
      const reviewDate = new Date(reviewTimestamp);
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const displayLocale = ui.localeMap[currentLocaleRef.value] || 'ko-KR';
      dateElement.textContent = reviewDate.toLocaleString(
        displayLocale,
        dateOptions
      );
    }
  });

  // 국가 선택 변경 이벤트 리스너
  if (languageSelect) {
    languageSelect.addEventListener('change', async function () {
      const selectedLang = this.value;
      currentLocaleRef.value = selectedLang;
      uiStringsRef.value = ui.hardcodedUiStrings[selectedLang]; // uiStringsRef 업데이트
      const displayLocale = ui.localeMap[selectedLang] || 'ko-KR';

      await ui.loadAndApplyHtmlTranslations(selectedLang, uiStringsRef.value);

      document.querySelectorAll('.review-item').forEach((reviewElement) => {
        const textElement = reviewElement.querySelector('.review-text-display');
        const dateElement = reviewElement.querySelector('.review-date');

        if (textElement) {
          const originalText = textElement.dataset.originalText;
          if (selectedLang === 'ko') {
            textElement.textContent = originalText;
          } else {
            review.translateSingleReview(
              textElement,
              originalText,
              selectedLang,
              uiStringsRef.value
            );
          }
        }
        if (dateElement && dateElement.dataset.timestamp) {
          const reviewTimestamp = dateElement.dataset.timestamp;
          const reviewDate = new Date(reviewTimestamp);
          const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          };
          dateElement.textContent = reviewDate.toLocaleString(
            displayLocale,
            dateOptions
          );
        }
      });

      if (aiSummaryParagraph && aiSummaryParagraph.dataset.originalText) {
        const originalSummary = aiSummaryParagraph.dataset.originalText;
        // updateAiSummaryDisplay 호출 시 업데이트된 uiStringsRef.value를 translateSingleReview에 전달
        ui.updateAiSummaryDisplay(
          originalSummary,
          selectedLang,
          uiStringsRef.value,
          aiSummaryParagraph,
          review.translateSingleReview
        );
      }
    });
  }
}

// 전역으로 export
window.eventListeners = {
  initializeEventListeners,
};
