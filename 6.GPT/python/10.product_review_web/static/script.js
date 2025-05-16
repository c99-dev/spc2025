// 이 파일은 이제 모달 내부의 스크립트 로직을 담당합니다.
// DOMContentLoaded 대신 product_list.js에서 호출될 함수로 변경합니다.

window.initializeModalScripts = function (modalLanguage) {
  // DOM 요소 가져오기 (모달 내부 요소들)
  // querySelector는 전체 문서에서 검색하므로, 모달이 여러 개가 아니라면 ID로 특정하거나,
  // 모달 컨테이너 내부에서 검색하도록 수정이 필요할 수 있습니다.
  // 여기서는 ID를 사용하여 유일성을 가정하거나, 모달 컨텐츠가 로드된 후 해당 컨텐츠 내에서 검색합니다.
  const modalRoot = document.getElementById('modalBodyContent'); // 모달 내용의 루트
  if (!modalRoot) {
    console.error('Modal body content not found for script initialization.');
    return;
  }

  const reviewForm = modalRoot.querySelector('.review-form');
  const reviewsListContainer = modalRoot.querySelector('.reviews-list');
  // productNameInput은 이제 모달 내의 hidden input (id="modalFormProductName")
  const productNameInput = modalRoot.querySelector('#modalFormProductName');
  const productName = productNameInput ? productNameInput.value : null;
  const aiSummaryParagraph = modalRoot.querySelector('.ai-summary-text');
  // languageSelect는 모달에 없으므로 제거 또는 product_list.js에서 받은 modalLanguage 사용
  // const languageSelect = document.getElementById('language-select'); // 모달에는 없음

  let currentLocale = modalLanguage || 'ko'; // product_list.js에서 전달받은 언어 사용

  const currentLocaleRef = { value: currentLocale };
  const uiStringsRef = {
    value: window.uiHandler.hardcodedUiStrings[currentLocaleRef.value],
  };

  // 모달 내부 UI 요소 번역 (data-translate-key가 있는 요소들)
  // 이 시점에는 modalBodyContent에 HTML이 로드되어 있으므로, 해당 컨텍스트 내에서 번역 적용
  // loadAndApplyHtmlTranslations는 전체 문서를 대상으로 하므로, 모달 내부 요소만 다시 번역하려면
  // 선택자를 더 구체적으로 지정하거나, 함수를 수정해야 할 수 있음.
  // 여기서는 uiHandler가 전체 문서를 대상으로 한다고 가정하고, 모달이 표시된 후 호출.
  window.uiHandler.loadAndApplyHtmlTranslations(
    currentLocaleRef.value,
    uiStringsRef.value
  );

  // AI 요약 번역 (모달 로드 시)
  if (aiSummaryParagraph && aiSummaryParagraph.dataset.originalText) {
    const originalSummary = aiSummaryParagraph.dataset.originalText;
    // 한국어가 아닐 때만 번역 요청
    if (currentLocaleRef.value !== 'ko') {
      window.uiHandler.updateAiSummaryDisplay(
        originalSummary,
        currentLocaleRef.value,
        uiStringsRef.value,
        aiSummaryParagraph,
        window.reviewHandler.translateSingleReview
      );
    } else {
      // 한국어일 경우 원본 텍스트로 설정 (이미 템플릿에서 설정되었을 수 있지만, 명시적으로)
      aiSummaryParagraph.textContent = originalSummary;
    }
  }

  // 리뷰 날짜 포맷팅 (모달 로드 시)
  modalRoot
    .querySelectorAll('.review-item .review-date')
    .forEach((dateElement) => {
      if (dateElement.dataset.timestamp) {
        const reviewTimestamp = dateElement.dataset.timestamp;
        const reviewDate = new Date(reviewTimestamp);
        const dateOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
        const displayLocale =
          window.uiHandler.localeMap[currentLocaleRef.value] || 'ko-KR';
        dateElement.textContent = reviewDate.toLocaleString(
          displayLocale,
          dateOptions
        );
      }
    });

  // 이벤트 리스너 초기화 (모달 내부 요소에 대해)
  // eventListeners.js의 initializeEventListeners 함수는 전체 문서를 대상으로 할 수 있으므로,
  // 모달 내부 요소에만 적용되도록 하거나, 모달 컨텍스트를 전달해야 할 수 있음.
  // 여기서는 initializeEventListeners가 이미 window 객체에 등록된 핸들러들을 사용한다고 가정.
  // languageSelect는 모달에 없으므로 null 또는 undefined로 전달될 수 있음.
  window.eventListeners.initializeEventListeners(
    currentLocaleRef,
    uiStringsRef,
    {
      reviewForm,
      reviewsListContainer,
      productName,
      aiSummaryParagraph,
      languageSelect: null,
    }, // languageSelect는 모달에 없음
    { ui: window.uiHandler, review: window.reviewHandler }
  );

  // product_list.js에서 언어 변경 시 모달 내부도 업데이트하는 로직 추가 필요
  // 예를 들어, product_list.js의 언어 변경 리스너에서 모달이 열려있다면,
  // 이 initializeModalScripts 함수를 새로운 언어 정보와 함께 다시 호출하거나,
  // 모달 내부의 특정 요소들만 업데이트하는 함수를 호출.
};

// 만약 product_list.js에서 모달을 열 때 언어 정보를 전달하고,
// 해당 언어에 맞게 모달 내부의 모든 텍스트(data-translate-key 포함)를 다시 번역/설정해야 한다면,
// initializeModalScripts 함수 내에서 해당 로직을 수행해야 합니다.
// loadAndApplyHtmlTranslations는 전체 문서를 대상으로 하므로,
// 모달 내부 요소만 다시 번역하려면 elementsToTranslate를 모달 내부로 한정해야 합니다.
// ui_handler.js의 loadAndApplyHtmlTranslations 함수를 수정하여 컨텍스트(루트 요소)를 받도록 하는 것이 좋습니다.
// 예: window.uiHandler.loadAndApplyHtmlTranslations(currentLocaleRef.value, uiStringsRef.value, modalRoot);
