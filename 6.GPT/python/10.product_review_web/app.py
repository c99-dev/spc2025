import sqlite3
from flask import Flask, render_template, request, jsonify  # jsonify 추가
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime  # datetime 모듈 추가

load_dotenv()

# OpenAI API 키 설정 (클라이언트 인스턴스화 시 사용)
client = OpenAI()  # api_key 인자는 환경변수 OPENAI_API_KEY를 자동으로 읽어옴

app = Flask(__name__, static_folder="static")
DATABASE = "reviews.db"

# 임시 상품 데이터
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

# 고정된 상품 (첫 번째 상품)
FIXED_PRODUCT = PRODUCTS[0]


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
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

    # 기존 예시 리뷰 삭제 (고정 상품에 대해서만)
    cursor.execute(
        "DELETE FROM reviews WHERE product_name = ?", (FIXED_PRODUCT["name"],)
    )

    # 예시 리뷰 데이터 추가
    example_reviews = [
        (
            FIXED_PRODUCT["name"],
            5,
            "정말 멋진 티셔츠입니다! 디자인도 예쁘고 재질도 좋아요. 강력 추천합니다!",
        ),
        (
            FIXED_PRODUCT["name"],
            4,
            "괜찮은 퀄리티입니다. 다만 사이즈가 조금 작은 것 같아서 한 치수 크게 주문할 걸 그랬어요.",
        ),
        (
            FIXED_PRODUCT["name"],
            3,
            "배송은 빨랐지만, 생각보다 색상이 화면과 좀 다르네요. 그래도 입을만 합니다.",
        ),
        (
            FIXED_PRODUCT["name"],
            5,
            "선물용으로 구매했는데 받는 사람이 아주 만족해합니다. 포장도 깔끔하게 와서 좋았어요.",
        ),
        (
            FIXED_PRODUCT["name"],
            2,
            "기대했던 것보다는 별로입니다. 가격 대비 품질이 아쉽네요.",
        ),
    ]
    cursor.executemany(
        "INSERT INTO reviews (product_name, rating, review_text) VALUES (?, ?, ?)",
        example_reviews,
    )

    conn.commit()
    conn.close()


@app.route("/")
def index():
    selected_product = FIXED_PRODUCT  # 랜덤 선택 대신 고정된 상품 사용
    conn = get_db_connection()
    raw_reviews = conn.execute(  # 변수명을 raw_reviews로 변경하여 후처리를 명확히 함
        "SELECT id, product_name, rating, review_text, created_at FROM reviews WHERE product_name = ? ORDER BY created_at DESC",  # id 추가
        (selected_product["name"],),
    ).fetchall()

    reviews = []  # 처리된 리뷰를 담을 새 리스트
    for row in raw_reviews:
        review_dict = dict(row)  # sqlite3.Row를 수정 가능한 dict로 변환
        if isinstance(review_dict["created_at"], str):
            # SQLite의 CURRENT_TIMESTAMP는 보통 'YYYY-MM-DD HH:MM:SS' 형식의 문자열을 반환
            review_dict["created_at"] = datetime.strptime(
                review_dict["created_at"], "%Y-%m-%d %H:%M:%S"
            )
        reviews.append(review_dict)

    ai_summary = "아직 등록된 리뷰가 없어 요약을 생성할 수 없습니다."
    if reviews:  # 처리된 reviews 리스트 사용
        review_texts = [review["review_text"] for review in reviews]

        # OpenAI API를 사용하여 요약 생성
        if review_texts:
            try:
                # 모든 리뷰를 하나의 문자열로 결합
                combined_reviews = "\n".join(review_texts)

                # 사용자에게 보여줄 프롬프트 (상품명 포함 및 출력 예시, 시작 개행 금지 명시)
                prompt_for_user = f"""{selected_product['name']}에 대한 다음 고객 리뷰들을 한국어로 간결하게 요약해줘.
요약 결과는 바로 내용으로 시작해야 하며, 맨 앞에 불필요한 줄바꿈을 넣지 마.

{combined_reviews}

출력 예시:
- 디자인이 예쁘다는 의견이 많습니다.
- 배송이 빠르다는 점도 장점으로 언급됩니다.
- 다만, 사이즈가 조금 작다는 의견도 있으니 참고하세요.
"""

                response = client.chat.completions.create(  # API 호출 방식 변경
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "당신은 고객 리뷰를 요약하는 유용한 AI 어시스턴트입니다.",
                        },
                        {"role": "user", "content": prompt_for_user},
                    ],
                    temperature=0.5,
                    max_tokens=150,
                    top_p=1.0,
                    frequency_penalty=0.0,
                    presence_penalty=0.0,
                )
                ai_summary = response.choices[
                    0
                ].message.content.strip()  # 응답 접근 방식 변경
            except Exception as e:
                print(f"OpenAI API 호출 중 오류 발생: {e}")
                ai_summary = (
                    "리뷰 요약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                )
        else:
            ai_summary = "요약할 리뷰 내용이 없습니다."

    conn.close()
    return render_template(
        "index.html", product=selected_product, reviews=reviews, ai_summary=ai_summary
    )


# 후기 목록을 JSON으로 반환하는 API 엔드포인트 추가
@app.route("/get_reviews/<product_name>")
def get_reviews(product_name):
    conn = get_db_connection()
    raw_reviews = conn.execute(
        "SELECT id, product_name, rating, review_text, created_at FROM reviews WHERE product_name = ? ORDER BY created_at DESC",
        (product_name,),
    ).fetchall()
    reviews_list = []
    for row in raw_reviews:
        review_item = dict(row)
        # 날짜/시간 필드를 ISO 형식 문자열로 변환 (JavaScript에서 쉽게 파싱 가능)
        if isinstance(review_item["created_at"], datetime):
            review_item["created_at"] = review_item["created_at"].isoformat()
        elif isinstance(review_item["created_at"], str):  # DB에서 문자열로 올 경우 대비
            try:
                dt_obj = datetime.strptime(
                    review_item["created_at"], "%Y-%m-%d %H:%M:%S"
                )
                review_item["created_at"] = dt_obj.isoformat()
            except ValueError:
                pass  # 변환 실패 시 원래 문자열 유지 (또는 오류 처리)

        reviews_list.append(review_item)
    conn.close()
    return jsonify(reviews_list)


@app.route("/submit_review", methods=["POST"])
def submit_review():
    if request.method == "POST":
        try:
            product_name = request.form["product_name"]
            rating = request.form["rating"]
            review_text = request.form["review_text"]

            if not product_name or not rating or not review_text:
                return (
                    jsonify({"success": False, "message": "모든 필드를 입력해주세요."}),
                    400,
                )

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO reviews (product_name, rating, review_text) VALUES (?, ?, ?)",
                (product_name, rating, review_text),
            )
            new_review_id = cursor.lastrowid  # 새로 추가된 리뷰의 ID 가져오기
            conn.commit()

            # 새로 추가된 리뷰 정보 가져오기
            new_review_raw = conn.execute(
                "SELECT id, product_name, rating, review_text, created_at FROM reviews WHERE id = ?",
                (new_review_id,),
            ).fetchone()
            conn.close()

            if new_review_raw:
                new_review = dict(new_review_raw)
                if isinstance(new_review["created_at"], str):
                    dt_obj = datetime.strptime(
                        new_review["created_at"], "%Y-%m-%d %H:%M:%S"
                    )
                    new_review["created_at"] = dt_obj.isoformat()
                elif isinstance(new_review["created_at"], datetime):
                    new_review["created_at"] = new_review["created_at"].isoformat()
                return jsonify(
                    {
                        "success": True,
                        "message": "후기가 성공적으로 등록되었습니다.",
                        "review": new_review,
                    }
                )
            else:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "후기 등록 후 정보를 가져오는데 실패했습니다.",
                        }
                    ),
                    500,
                )

        except Exception as e:
            print(f"Error submitting review: {e}")
            # 실제 운영 환경에서는 에러 로깅을 더 상세히 해야 합니다.
            return (
                jsonify(
                    {"success": False, "message": "후기 등록 중 오류가 발생했습니다."}
                ),
                500,
            )
        # return redirect(url_for("index")) # JSON 응답으로 변경


# 리뷰 삭제를 위한 API 엔드포인트 추가
@app.route("/delete_review/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM reviews WHERE id = ?", (review_id,))
        conn.commit()

        if cursor.rowcount > 0:
            conn.close()
            return jsonify(
                {"success": True, "message": "리뷰가 성공적으로 삭제되었습니다."}
            )
        else:
            conn.close()
            return (
                jsonify(
                    {"success": False, "message": "삭제할 리뷰를 찾지 못했습니다."}
                ),
                404,
            )

    except Exception as e:
        print(f"Error deleting review: {e}")
        # 실제 운영 환경에서는 에러 로깅을 더 상세히 해야 합니다.
        if conn:
            conn.close()
        return (
            jsonify({"success": False, "message": "리뷰 삭제 중 오류가 발생했습니다."}),
            500,
        )


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
