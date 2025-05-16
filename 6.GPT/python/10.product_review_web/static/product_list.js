document.addEventListener('DOMContentLoaded', async function () {
  // async 추가
  const modal = document.getElementById('productDetailModal');
  const modalBody = document.getElementById('modalBodyContent');
  const closeModalButton = modal.querySelector('.close-button');
  const productCards = document.querySelectorAll('.product-card');
  const languageSelectList = document.getElementById('language-select-list'); // 상품 목록 페이지의 언어 선택

  let currentListLocale = languageSelectList ? languageSelectList.value : 'ko';
  // 현재 언어에 맞는 UI 문자열 가져오기 (uiHandler.js의 hardcodedUiStrings 사용)
  let currentHardcodedStrings =
    window.uiHandler.hardcodedUiStrings[currentListLocale];

  // 모달 열기
  function openModal(productName) {
    // 현재 선택된 언어를 포함하여 상품 상세 정보 요청
    fetch(
      `/get_product_details/${encodeURIComponent(
        productName
      )}?lang=${currentListLocale}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          modalBody.innerHTML = data.html_content;
          modal.style.display = 'block';
          // 모달이 열린 후, 모달 내부의 스크립트(script.js)가 DOM을 인식하고 초기화하도록 이벤트 발생 또는 함수 직접 호출
          // script.js가 DOMContentLoaded 대신 커스텀 이벤트를 수신하도록 수정하거나,
          // 모달 컨텐츠 로드 후 script.js의 초기화 함수를 직접 호출하는 방식 사용.
          // 여기서는 script.js의 초기화 로직을 함수로 만들어 호출한다고 가정.
          if (window.initializeModalScripts) {
            // data.product_data, data.reviews_data, data.ai_summary_data 등을 전달하여
            // script.js가 이 데이터로 모달 내부를 다시 그리거나 상태를 설정하도록 할 수 있음.
            // 또는 script.js가 자체적으로 data-original-text 등을 읽도록 함.
            // 현재는 html_content에 모든 정보가 포함되어 있으므로, script.js가 DOM을 다시 스캔하여 초기화.
            window.initializeModalScripts(currentListLocale); // 현재 언어 정보 전달
          }
        } else {
          // 하드코딩된 문자열 사용
          alert(
            currentHardcodedStrings.error_loading_product_details_failed +
              (data.message || '')
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        // 하드코딩된 문자열 사용
        alert(currentHardcodedStrings.error_loading_product_details_generic);
      });
  }

  // 모달 닫기
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      modalBody.innerHTML = ''; // 내용 비우기
    }
  }

  if (closeModalButton) {
    closeModalButton.onclick = closeModal;
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      // 이 부분이 모달 외부 클릭 시 닫는 로직입니다.
      closeModal();
    }
  };

  productCards.forEach((card) => {
    card.addEventListener('click', function () {
      const productName = this.dataset.productName;
      openModal(productName);
    });
  });

  // 상품 목록 페이지 언어 변경 처리
  if (languageSelectList) {
    languageSelectList.addEventListener('change', async function () {
      currentListLocale = this.value;
      // 현재 언어에 맞는 UI 문자열 업데이트
      currentHardcodedStrings =
        window.uiHandler.hardcodedUiStrings[currentListLocale];

      const listUiStrings =
        window.uiHandler.hardcodedUiStrings[currentListLocale] ||
        window.uiHandler.hardcodedUiStrings['ko'];
      // products.html의 title, h1 등 data-translate-key가 있는 요소 번역
      await window.uiHandler.loadAndApplyHtmlTranslations(
        currentListLocale,
        listUiStrings,
        document
      ); // 전체 문서 대상

      // 모달이 열려있다면 모달 내부도 업데이트
      if (modal.style.display === 'block' && window.initializeModalScripts) {
        // 모달 내부 컨텐츠를 다시 로드하거나, 현재 컨텐츠를 새 언어로 업데이트
        // 여기서는 모달을 닫고, 사용자가 다시 클릭하여 새 언어로 로드하도록 유도하거나,
        // 또는 openModal을 다시 호출하여 컨텐츠를 새 언어로 갱신할 수 있습니다.
        // 가장 간단한 방법은 initializeModalScripts를 새 언어로 다시 호출하는 것입니다.
        // 단, initializeModalScripts가 모달 내부의 data-original-text를 기반으로 번역을 다시 수행해야 합니다.

        // 현재 모달의 상품명을 가져와서 openModal을 다시 호출하여 컨텐츠를 갱신하는 방법
        const currentModalProductNameInput = modalBody.querySelector(
          '#modalFormProductName'
        );
        if (
          currentModalProductNameInput &&
          currentModalProductNameInput.value
        ) {
          openModal(currentModalProductNameInput.value); // 현재 열린 상품으로 모달 내용 갱신
        } else {
          // 또는 단순히 모달 내부 스크립트만 재실행 (텍스트 번역은 initializeModalScripts 내부에서 처리)
          window.initializeModalScripts(currentListLocale);
        }
      }
    });
    // 초기 로드 시 상품 목록 페이지 UI 번역
    const initialListUiStrings =
      window.uiHandler.hardcodedUiStrings[currentListLocale] ||
      window.uiHandler.hardcodedUiStrings['ko'];
    // 이 부분도 await를 사용하므로, DOMContentLoaded의 콜백이 async여야 함
    await window.uiHandler.loadAndApplyHtmlTranslations(
      currentListLocale,
      initialListUiStrings,
      document
    );
  }
});
