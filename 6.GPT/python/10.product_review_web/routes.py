from flask import render_template, request, jsonify
from datetime import datetime
from db_utils import get_db_connection  # 상대 경로 대신 절대 경로로 수정되었음을 가정
from translation_utils import generate_ai_summary, translate_text_openai
from config import (
    UI_TRANSLATIONS,
    PRODUCTS,
    FIXED_PRODUCT_NAME,
)  # FIXED_PRODUCT_NAME 임포트


def configure_routes(app):

    def get_product_by_name(product_name_to_find):
        for p in PRODUCTS:
            if p["name"] == product_name_to_find:
                return p
        return None  # 못 찾으면 None 반환

    @app.route("/")
    def product_list_page():
        current_lang = request.args.get("lang", "ko")
        lang_bundle = UI_TRANSLATIONS.get(current_lang, UI_TRANSLATIONS.get("ko", {}))

        products_for_template = []
        for p_item in PRODUCTS:  # FIXED_PRODUCT 대신 PRODUCTS 전체를 순회
            product_copy = p_item.copy()
            # 상품명 번역 키 생성 (예: "product_name_멋진 티셔츠")
            product_name_key = f"product_name_{p_item['name']}"
            # 번역된 상품명 가져오기. 없으면 원본 이름 사용.
            product_copy["translated_name"] = lang_bundle.get(
                product_name_key, p_item["name"]
            )
            products_for_template.append(product_copy)

        return render_template("products.html", products_list=products_for_template)

    @app.route("/get_product_details/<product_name>")
    def get_product_details_for_modal(product_name):
        selected_product = get_product_by_name(product_name)
        if not selected_product:
            return (
                jsonify({"success": False, "message": "상품을 찾을 수 없습니다."}),
                404,
            )

        current_lang = request.args.get("lang", "ko")

        conn = get_db_connection()
        raw_reviews = conn.execute(
            "SELECT id, product_name, rating, review_text, created_at FROM reviews WHERE product_name = ? ORDER BY created_at DESC",
            (selected_product["name"],),
        ).fetchall()
        reviews = []
        for row in raw_reviews:
            review_dict = dict(row)
            created_at_val = review_dict["created_at"]
            if isinstance(created_at_val, datetime):
                review_dict["created_at_iso"] = created_at_val.isoformat()
                # Jinja 템플릿에서는 strftime을 사용하므로 datetime 객체도 전달
                review_dict["created_at_dt"] = created_at_val
            elif isinstance(created_at_val, str):
                try:
                    # DB에서 문자열로 온 경우 datetime 객체로 변환 후 isoformat과 객체 모두 전달
                    dt_obj = datetime.strptime(created_at_val, "%Y-%m-%d %H:%M:%S")
                    review_dict["created_at_iso"] = dt_obj.isoformat()
                    review_dict["created_at_dt"] = dt_obj
                except ValueError:
                    # 변환 실패 시, 원본 문자열을 iso로 간주하고, 현재 시간을 dt로 설정 (또는 오류 처리)
                    review_dict["created_at_iso"] = created_at_val
                    review_dict["created_at_dt"] = (
                        datetime.now()
                    )  # 또는 None, 또는 오류 메시지
            else:  # 예상치 못한 타입
                review_dict["created_at_iso"] = datetime.now().isoformat()
                review_dict["created_at_dt"] = datetime.now()
            reviews.append(review_dict)
        conn.close()

        ai_summary_text = generate_ai_summary(selected_product["name"], current_lang)

        lang_bundle = UI_TRANSLATIONS.get(current_lang, UI_TRANSLATIONS.get("ko", {}))
        product_name_key = f"product_name_{selected_product['name']}"
        translated_product_name = lang_bundle.get(
            product_name_key, selected_product["name"]
        )

        display_product = selected_product.copy()
        display_product["translated_name"] = translated_product_name

        modal_html_content = render_template(
            "index.html",
            product=display_product,
            reviews=reviews,  # 이제 review 객체는 created_at_iso와 created_at_dt를 가짐
            ai_summary=ai_summary_text,
        )
        return jsonify(
            {
                "success": True,
                "html_content": modal_html_content,
                "product_data": display_product,
                "reviews_data": reviews,
                "ai_summary_data": ai_summary_text,
            }
        )

    @app.route("/translate_ui", methods=["POST"])
    def translate_ui_elements():
        data = request.get_json()
        keys = data.get("keys")
        target_lang = data.get("target_lang")

        if not keys or not target_lang:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "키 또는 대상 언어가 제공되지 않았습니다.",
                    }
                ),
                400,
            )

        translations = {}
        lang_bundle = UI_TRANSLATIONS.get(target_lang, UI_TRANSLATIONS.get("ko", {}))

        if isinstance(keys, list):
            for key in keys:
                translations[key] = lang_bundle.get(key, f"Untranslated: {key}")
        elif isinstance(keys, str):
            translations[keys] = lang_bundle.get(keys, f"Untranslated: {keys}")
        else:
            return jsonify({"success": False, "message": "잘못된 키 형식입니다."}), 400

        return jsonify({"success": True, "translations": translations})

    @app.route("/translate_review", methods=["POST"])
    def translate_review_route():
        data = request.get_json()
        original_text = data.get("text")
        target_language = data.get("target_lang")

        if not original_text or not target_language:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "텍스트 또는 대상 언어가 제공되지 않았습니다.",
                    }
                ),
                400,
            )

        translated_text = translate_text_openai(original_text, target_language)

        if (
            "번역 중 오류 발생" in translated_text
            and "번역 서비스 오류" not in translated_text
        ):
            return (
                jsonify(
                    {
                        "success": False,
                        "translated_text": translated_text,
                        "message": "번역 서비스 오류",
                    }
                ),
                500,
            )

        return jsonify({"success": True, "translated_text": translated_text})

    @app.route("/get_reviews/<product_name>")
    def get_reviews(
        product_name,
    ):  # 이 라우트는 모달 내에서 리뷰만 새로고침할 때 사용될 수 있음
        conn = get_db_connection()
        raw_reviews = conn.execute(
            "SELECT id, product_name, rating, review_text, created_at FROM reviews WHERE product_name = ? ORDER BY created_at DESC",
            (product_name,),
        ).fetchall()
        reviews_list = []
        for row in raw_reviews:
            review_item = dict(row)
            if isinstance(review_item["created_at"], datetime):
                review_item["created_at"] = review_item["created_at"].isoformat()
            elif isinstance(review_item["created_at"], str):
                try:
                    dt_obj = datetime.strptime(
                        review_item["created_at"], "%Y-%m-%d %H:%M:%S"
                    )
                    review_item["created_at"] = dt_obj.isoformat()
                except ValueError:
                    pass
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
                current_lang = request.form.get("current_language", "ko")

                if not product_name or not rating or not review_text:
                    return (
                        jsonify(
                            {"success": False, "message": "모든 필드를 입력해주세요."}
                        ),
                        400,
                    )

                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO reviews (product_name, rating, review_text) VALUES (?, ?, ?)",
                    (product_name, rating, review_text),
                )
                new_review_id = cursor.lastrowid
                conn.commit()

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

                    updated_ai_summary = generate_ai_summary(product_name, current_lang)
                    return jsonify(
                        {
                            "success": True,
                            "message": "후기가 성공적으로 등록되었습니다.",
                            "review": new_review,
                            "ai_summary": updated_ai_summary,
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
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "후기 등록 중 오류가 발생했습니다.",
                        }
                    ),
                    500,
                )

    @app.route("/delete_review/<int:review_id>", methods=["DELETE"])
    def delete_review(review_id):
        try:
            current_lang = request.args.get("current_language", "ko")
            conn = get_db_connection()
            cursor = conn.cursor()
            product_name_query = cursor.execute(
                "SELECT product_name FROM reviews WHERE id = ?", (review_id,)
            ).fetchone()

            cursor.execute("DELETE FROM reviews WHERE id = ?", (review_id,))
            conn.commit()

            if cursor.rowcount > 0:
                # FIXED_PRODUCT_NAME을 기본값으로 사용
                product_name_for_summary = (
                    product_name_query["product_name"]
                    if product_name_query
                    else FIXED_PRODUCT_NAME
                )
                conn.close()
                updated_ai_summary = generate_ai_summary(
                    product_name_for_summary, current_lang
                )
                return jsonify(
                    {
                        "success": True,
                        "message": "리뷰가 성공적으로 삭제되었습니다.",
                        "ai_summary": updated_ai_summary,
                    }
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
            # conn이 정의되지 않았을 수 있으므로 확인 후 close
            if (
                "conn" in locals() and conn
            ):  # conn 변수가 정의되어 있고, None이 아닐 때 close
                conn.close()
            return (
                jsonify(
                    {"success": False, "message": "리뷰 삭제 중 오류가 발생했습니다."}
                ),
                500,
            )
