from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL_SUMMARY, OPENAI_MODEL_TRANSLATE
from db_utils import get_db_connection

client = OpenAI(api_key=OPENAI_API_KEY)


def translate_text_openai(text, target_language_code):
    if not text:
        return ""

    language_map = {
        "en": "English",
        "ja": "Japanese",
        "zh": "Chinese",
        "ko": "Korean",
    }
    target_language_name = language_map.get(target_language_code, "Korean")

    if target_language_code == "ko":  # 원본이 한국어라고 가정
        return text

    try:
        prompt = f"Translate the following Korean text to {target_language_name}. Respond only with the translated text, without any introductory phrases or explanations:\n\n{text}"
        response = client.chat.completions.create(
            model=OPENAI_MODEL_TRANSLATE,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful translation assistant. You will translate Korean text into {target_language_name}.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=len(text) * 3,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )
        translated_text = response.choices[0].message.content.strip()
        return translated_text
    except Exception as e:
        print(f"Error during translation to {target_language_name}: {e}")
        return f"번역 중 오류 발생 ({target_language_name})"


def generate_ai_summary(product_name_for_summary, target_language_code="ko"):
    conn = get_db_connection()
    reviews_for_summary = conn.execute(
        "SELECT review_text FROM reviews WHERE product_name = ?",
        (product_name_for_summary,),
    ).fetchall()
    conn.close()

    if not reviews_for_summary:
        no_review_message_ko = "아직 등록된 리뷰가 없어 요약을 생성할 수 없습니다."
        if target_language_code == "ko":
            return no_review_message_ko
        return translate_text_openai(no_review_message_ko, target_language_code)

    review_texts = [r["review_text"] for r in reviews_for_summary]
    combined_reviews = "\n".join(review_texts)

    prompt_for_user = f"""{product_name_for_summary}에 대한 다음 고객 리뷰들을 한국어로 3줄 이내로 간결하게 요약해줘.
요약 결과는 바로 내용으로 시작해야 하며, 맨 앞에 불필요한 줄바꿈을 넣지 마.

{combined_reviews}

출력 예시:
- 디자인이 예쁘다는 의견이 많습니다.
- 배송이 빠르다는 점도 장점으로 언급됩니다.
- 다만, 사이즈가 조금 작다는 의견도 있으니 참고하세요.
"""
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL_SUMMARY,
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
        summary_ko = response.choices[0].message.content.strip()

        if target_language_code == "ko":
            return summary_ko
        else:
            translated_summary = translate_text_openai(summary_ko, target_language_code)
            if (
                "번역 중 오류 발생" in translated_summary
                and "번역 서비스 오류" not in translated_summary
            ):
                return summary_ko
            return translated_summary
    except Exception as e:
        print(f"OpenAI API 호출 중 오류 발생: {e}")
        error_message_ko = (
            "리뷰 요약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        )
        if target_language_code == "ko":
            return error_message_ko
        return translate_text_openai(error_message_ko, target_language_code)
