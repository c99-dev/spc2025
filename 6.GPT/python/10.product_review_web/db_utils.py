import sqlite3
from config import DATABASE_URL, PRODUCTS  # PRODUCTS 임포트


def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            review_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # 모든 상품에 대한 기존 예시 리뷰 삭제
    for product in PRODUCTS:
        cursor.execute("DELETE FROM reviews WHERE product_name = ?", (product["name"],))

    # 각 상품별 예시 리뷰 데이터 추가
    example_reviews_data = {
        "멋진 티셔츠": [
            (
                5,
                "정말 멋진 티셔츠입니다! 디자인도 예쁘고 재질도 좋아요. 강력 추천합니다!",
            ),
            (
                4,
                "괜찮은 퀄리티입니다. 다만 사이즈가 조금 작은 것 같아서 한 치수 크게 주문할 걸 그랬어요.",
            ),
            (
                3,
                "배송은 빨랐지만, 생각보다 색상이 화면과 좀 다르네요. 그래도 입을만 합니다.",
            ),
            (
                5,
                "선물용으로 구매했는데 받는 사람이 아주 만족해합니다. 포장도 깔끔하게 와서 좋았어요.",
            ),
            (2, "기대했던 것보다는 별로입니다. 가격 대비 품질이 아쉽네요."),
        ],
        "편안한 청바지": [
            (5, "정말 편하고 핏도 예뻐요. 매일 입고 다닙니다!"),
            (4, "소재가 부드럽고 활동하기 편합니다. 색상도 마음에 들어요."),
            (3, "길이가 조금 길어서 수선했어요. 그 외에는 만족합니다."),
            (5, "인생 청바지를 찾았네요! 다른 색상도 구매하고 싶어요."),
            (4, "가격 대비 품질이 훌륭합니다. 추천!"),
        ],
        "스타일리시한 스니커즈": [
            (5, "디자인이 정말 유니크하고 예뻐요. 착화감도 좋습니다."),
            (4, "어떤 옷에도 잘 어울려서 코디하기 편해요."),
            (3, "처음에는 발볼이 좀 끼는 느낌이었는데, 신다 보니 괜찮아졌어요."),
            (5, "친구들이 다 어디서 샀냐고 물어봐요! 대만족입니다."),
            (2, "생각보다 굽이 높아서 조금 불편하네요. 디자인은 예쁩니다."),
        ],
        "따뜻한 스웨터": [
            (5, "정말 따뜻하고 부드러워요. 겨울 필수템입니다!"),
            (4, "색감이 예쁘고 두께도 적당해서 만족스럽습니다."),
            (3, "몇 번 입으니 보풀이 좀 생기네요. 관리가 필요할 것 같아요."),
            (5, "포근한 느낌이 너무 좋아요. 다른 색상도 구매 예정입니다."),
            (4, "가격도 적당하고 품질도 괜찮아서 만족합니다."),
        ],
        "방수 자켓": [
            (5, "비 오는 날 정말 유용해요! 방수 기능 최고입니다."),
            (4, "가볍고 휴대하기 좋아서 여행 갈 때도 잘 쓰고 있어요."),
            (3, "디자인이 조금 더 다양했으면 좋겠어요. 기능성은 만족합니다."),
            (5, "바람도 잘 막아주고, 비도 안 새서 정말 좋아요!"),
            (4, "등산 갈 때 입으려고 샀는데, 아주 만족스럽습니다."),
        ],
    }

    for product in PRODUCTS:
        product_name = product["name"]
        if product_name in example_reviews_data:
            reviews_for_product = [
                (product_name, rating, review_text)
                for rating, review_text in example_reviews_data[product_name]
            ]
            cursor.executemany(
                "INSERT INTO reviews (product_name, rating, review_text) VALUES (?, ?, ?)",
                reviews_for_product,
            )

    conn.commit()
    conn.close()
