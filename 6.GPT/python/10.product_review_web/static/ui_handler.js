// JavaScript 내부에서 사용할 UI 문자열 (하드코딩)
const hardcodedUiStrings = {
  ko: {
    translating_review: '번역 중...',
    translation_failed: '번역 실패',
    translation_error_request: '번역 요청 오류',
    confirm_delete_review: '정말로 이 리뷰를 삭제하시겠습니까?',
    error_alert_prefix: '오류: ',
    submitting_review_button: '등록 중...',
    error_submitting_review: '후기 등록 중 오류가 발생했습니다.',
    error_deleting_review: '리뷰 삭제 중 오류가 발생했습니다.',
    error_loading_reviews: '후기를 불러오는 중 오류가 발생했습니다.',
    no_summary_text: '아직 등록된 리뷰가 없어 요약을 생성할 수 없습니다.',
    // product_list.js 용 추가
    error_loading_product_details_failed:
      '상품 상세 정보를 불러오는데 실패했습니다: ',
    error_loading_product_details_generic: '상품 상세 정보 로딩 중 오류 발생',
  },
  en: {
    translating_review: 'Translating...',
    translation_failed: 'Translation failed',
    translation_error_request: 'Translation request error',
    confirm_delete_review: 'Are you sure you want to delete this review?',
    error_alert_prefix: 'Error: ',
    submitting_review_button: 'Submitting...',
    error_submitting_review: 'An error occurred while submitting the review.',
    error_deleting_review: 'An error occurred while deleting the review.',
    error_loading_reviews: 'An error occurred while loading reviews.',
    no_summary_text: 'No reviews available to generate a summary.',
    // product_list.js 용 추가
    error_loading_product_details_failed: 'Failed to load product details: ',
    error_loading_product_details_generic: 'Error loading product details',
  },
  ja: {
    translating_review: '翻訳中...',
    translation_failed: '翻訳失敗',
    translation_error_request: '翻訳リクエストエラー',
    confirm_delete_review: '本当にこのレビューを削除しますか？',
    error_alert_prefix: 'エラー: ',
    submitting_review_button: '登録中...',
    error_submitting_review: 'レビューの登録中にエラーが発生しました。',
    error_deleting_review: 'レビューの削除中にエラーが発生しました。',
    error_loading_reviews: 'レビューの読み込み中にエラーが発生しました。',
    no_summary_text: '要約を生成するためのレビューがまだありません。',
    // product_list.js 용 추가
    error_loading_product_details_failed: '商品詳細の読み込みに失敗しました: ',
    error_loading_product_details_generic:
      '商品詳細の読み込み中にエラーが発生しました',
  },
  zh: {
    translating_review: '翻译中...',
    translation_failed: '翻译失败',
    translation_error_request: '翻译请求错误',
    confirm_delete_review: '您确定要删除这条评价吗？',
    error_alert_prefix: '错误: ',
    submitting_review_button: '提交中...',
    error_submitting_review: '提交评价时发生错误。',
    error_deleting_review: '删除评价时发生错误。',
    error_loading_reviews: '加载评价时发生错误。',
    no_summary_text: '目前没有可用于生成摘要的评价。',
    // product_list.js 용 추가
    error_loading_product_details_failed: '加载产品详细信息失败: ',
    error_loading_product_details_generic: '加载产品详细信息时出错',
  },
};

// BCP 47 언어 태그 매핑 (toLocaleString에 사용)
const localeMap = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

// UI 문자열 로드 및 적용 함수 (HTML 내 data-translate-key 요소 대상)
// contextElement 인자를 추가하여 특정 DOM 트리 내에서만 검색하도록 할 수 있음 (선택적)
async function loadAndApplyHtmlTranslations(
  lang,
  currentUiStrings,
  contextElement = document
) {
  const elementsToTranslate = contextElement.querySelectorAll(
    '[data-translate-key]'
  );
  if (elementsToTranslate.length === 0) return;

  const keys = Array.from(elementsToTranslate)
    .map((el) => el.dataset.translateKey)
    .filter((key) => key !== 'ai_summary_content');

  if (keys.length === 0) return;

  try {
    const response = await fetch('/translate_ui', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys: keys, target_lang: lang }),
    });
    const data = await response.json();
    if (data.success) {
      elementsToTranslate.forEach((element) => {
        const key = element.dataset.translateKey;
        if (key === 'ai_summary_content') return;

        const translatedText = data.translations[key];
        if (translatedText) {
          if (element.tagName === 'TEXTAREA' && element.placeholder) {
            element.placeholder = translatedText;
          } else if (
            element.tagName === 'BUTTON' &&
            element.querySelector('span[data-translate-key]')
          ) {
            const spanElement = element.querySelector(
              `span[data-translate-key="${key}"]`
            );
            if (spanElement) spanElement.textContent = translatedText;
            else element.textContent = translatedText;
          } else {
            element.textContent = translatedText;
          }
        }
      });
    } else {
      console.error(
        'Failed to load UI translations for HTML elements:',
        data.message
      );
    }
  } catch (error) {
    console.error('Error loading UI translations for HTML elements:', error);
  }
}

// AI 요약 업데이트 및 번역 함수
function updateAiSummaryDisplay(
  summaryText,
  lang,
  currentUiStrings,
  aiSummaryParagraphElement,
  translateFunction
) {
  if (aiSummaryParagraphElement) {
    aiSummaryParagraphElement.dataset.originalText = summaryText;
    if (
      summaryText === hardcodedUiStrings.ko.no_summary_text ||
      summaryText === hardcodedUiStrings.en.no_summary_text ||
      summaryText === hardcodedUiStrings.ja.no_summary_text ||
      summaryText === hardcodedUiStrings.zh.no_summary_text
    ) {
      aiSummaryParagraphElement.textContent =
        currentUiStrings.no_summary_text || summaryText;
    } else if (lang === 'ko') {
      aiSummaryParagraphElement.textContent = summaryText;
    } else {
      // translateFunction 호출 시 currentUiStrings 전달
      translateFunction(
        aiSummaryParagraphElement,
        summaryText,
        lang,
        currentUiStrings
      );
    }
  } else {
    const aiSummaryContainer = document.querySelector('.ai-summary');
    if (aiSummaryContainer) {
      let pTag = aiSummaryContainer.querySelector('.ai-summary-text');
      if (!pTag) {
        pTag = document.createElement('p');
        pTag.className =
          'text-slate-700 text-base leading-relaxed prose prose-indigo ai-summary-text';
        const noSummaryMsg =
          aiSummaryContainer.querySelector('p.text-slate-500');
        if (noSummaryMsg) noSummaryMsg.remove();
        const h3Tag = aiSummaryContainer.querySelector('h3');
        if (h3Tag && h3Tag.nextSibling) {
          aiSummaryContainer.insertBefore(pTag, h3Tag.nextSibling);
        } else if (h3Tag) {
          aiSummaryContainer.appendChild(pTag);
        } else {
          aiSummaryContainer.appendChild(pTag);
        }
      }
      pTag.textContent = summaryText; // 초기에는 번역 없이 표시, 필요시 translateFunction 호출
    }
  }
}

// 전역으로 export (script.js에서 사용하기 위함)
window.uiHandler = {
  hardcodedUiStrings,
  localeMap,
  loadAndApplyHtmlTranslations,
  updateAiSummaryDisplay,
};
