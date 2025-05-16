import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = "reviews.db"

# 임시 상품 데이터 (실제 애플리케이션에서는 DB나 다른 소스에서 가져올 수 있음)
PRODUCTS = [
    {
        "id": 1,
        "name": "멋진 티셔츠",
        "image_url": "https://picsum.photos/seed/1/400/300",
    },
    {
        "id": 2,
        "name": "편안한 청바지",
        "image_url": "https://picsum.photos/seed/2/400/300",
    },
    {
        "id": 3,
        "name": "스타일리시한 스니커즈",
        "image_url": "https://picsum.photos/seed/3/400/300",
    },
    {
        "id": 4,
        "name": "따뜻한 스웨터",
        "image_url": "https://picsum.photos/seed/4/400/300",
    },
    {"id": 5, "name": "방수 자켓", "image_url": "https://picsum.photos/seed/5/400/300"},
]
FIXED_PRODUCT_NAME = "멋진 티셔츠"  # 또는 PRODUCTS[0]["name"]

# UI 번역 문자열
UI_TRANSLATIONS = {
    "ko": {
        "header_title": "상품 후기",  # 모달 헤더용 (필요시 유지 또는 product_detail_header 등으로 변경)
        "ai_summary_title": "AI 요약",
        "write_review_title": "후기 작성하기",
        "rating_label": "상품은 어떠셨나요? (평점)",
        "review_text_label": "자세한 후기를 들려주세요:",
        "review_text_placeholder": "솔직한 후기를 남겨주세요. (예: 디자인이 예뻐요, 배송이 빨라요)",
        "submit_review_button": "후기 등록",
        "other_reviews_title": "다른 분들의 후기",
        "delete_button": "삭제",
        "no_reviews_yet": "아직 등록된 후기가 없습니다. 첫 후기를 작성해주세요!",
        "product_name_멋진 티셔츠": "멋진 티셔츠",
        "product_name_편안한 청바지": "편안한 청바지",
        "product_name_스타일리시한 스니커즈": "스타일리시한 스니커즈",
        "product_name_따뜻한 스웨터": "따뜻한 스웨터",
        "product_name_방수 자켓": "방수 자켓",
        # 상품 목록 페이지용 번역 추가
        "product_list_page_title": "상품 목록",
        "product_list_header": "상품 목록",
    },
    "en": {
        "header_title": "Product Reviews",
        "ai_summary_title": "AI Summary",
        "write_review_title": "Write a Review",
        "rating_label": "How was the product? (Rating)",
        "review_text_label": "Tell us more details:",
        "review_text_placeholder": "Please leave an honest review. (e.g., Great design, Fast shipping)",
        "submit_review_button": "Submit Review",
        "other_reviews_title": "Others' Reviews",
        "delete_button": "Delete",
        "no_reviews_yet": "No reviews yet. Be the first to write one!",
        "product_name_멋진 티셔츠": "Awesome T-shirt",
        "product_name_편안한 청바지": "Comfortable Jeans",
        "product_name_스타일리시한 스니커즈": "Stylish Sneakers",
        "product_name_따뜻한 스웨터": "Warm Sweater",
        "product_name_방수 자켓": "Waterproof Jacket",
        # 상품 목록 페이지용 번역 추가
        "product_list_page_title": "Product List",
        "product_list_header": "Product List",
    },
    "ja": {
        "header_title": "商品レビュー",
        "ai_summary_title": "AI要約",
        "write_review_title": "レビューを書く",
        "rating_label": "商品はいかがでしたか？ (評価)",
        "review_text_label": "詳細なレビューをお聞かせください:",
        "review_text_placeholder": "率直なレビューを残してください。(例: デザインが素敵、配送が早い)",
        "submit_review_button": "レビュー登録",
        "other_reviews_title": "他の方のレビュー",
        "delete_button": "削除",
        "no_reviews_yet": "まだレビューがありません。最初のレビューを書いてみましょう！",
        "product_name_멋진 티셔츠": "素敵なTシャツ",
        "product_name_편안한 청바지": "快適なジーンズ",
        "product_name_스타일리시한 스니커즈": "スタイリッシュなスニーカー",
        "product_name_따뜻한 스웨터": "暖かいセーター",
        "product_name_방수 자켓": "防水ジャケット",
        # 상품 목록 페이지용 번역 추가
        "product_list_page_title": "商品一覧",
        "product_list_header": "商品一覧",
    },
    "zh": {
        "header_title": "商品评价",
        "ai_summary_title": "AI总结",
        "write_review_title": "撰写评价",
        "rating_label": "您对商品满意吗？ (评分)",
        "review_text_label": "请告诉我们更多细节:",
        "review_text_placeholder": "请留下真实的评价。(例如：设计精美，发货快)",
        "submit_review_button": "提交评价",
        "other_reviews_title": "其他人的评价",
        "delete_button": "删除",
        "no_reviews_yet": "暂无评价。快来写下第一条评价吧！",
        "product_name_멋진 티셔츠": "很棒的T恤",
        "product_name_편안한 청바지": "舒适的牛仔裤",
        "product_name_스타일리시한 스니커즈": "时尚运动鞋",
        "product_name_따뜻한 스웨터": "保暖毛衣",
        "product_name_방수 자켓": "防水夹克",
        # 상품 목록 페이지용 번역 추가
        "product_list_page_title": "产品列表",
        "product_list_header": "产品列表",
    },
}

# OpenAI 모델 설정
OPENAI_MODEL_SUMMARY = "gpt-4o-mini"
OPENAI_MODEL_TRANSLATE = "gpt-4o-mini"
