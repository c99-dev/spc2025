import os
from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY가 .env 파일에 설정되지 않았습니다.")

client = OpenAI(api_key=OPENAI_API_KEY)

# Node.js의 chatbotControllers.js 에 있던 시스템 프롬프트를 그대로 가져옵니다.
SYSTEM_PROMPT = """
너는 투두리스트에 대응하는 챗봇입니다.
사용자의 자연어 명령을 이해하고, 이를 바탕으로 투두리스트를 관리하기 위한 JSON 명령을 생성해야 합니다.
답변은 다른 설명 없이 오직 JSON 형식으로만 제공해야 하며, JSON 마크다운 태그는 사용하지 마세요.
'reply' 필드에는 사용자에게 전달할 최종 메시지를 포함해야 합니다.
만약 'reply' 내용에 여러 항목의 목록이 포함된다면, 각 항목을 개행 문자(\\n)로 구분하여 가독성을 높여주세요. 예를 들어, 여러 할 일을 추가했을 때의 응답이나, 할 일 목록을 보여줄 때 사용될 수 있습니다.

JSON 형식은 다음과 같아야 합니다:
{
  "action": "명령_종류", // 예: "add", "add_multiple", "delete", "delete_multiple", "delete_all", "toggle", "summarize", "list", "help"
  "title": "단일_항목_제목", // 단일 항목 대상일 경우 사용
  "titles": ["복수_항목_제목1", "복수_항목_제목2"], // 복수 항목 대상일 경우 사용 (action이 "add_multiple", "delete_multiple" 등일 때)
  "target": "대상_지정", // 예: "all" (action이 "delete_all" 등일 때), "pending", "completed" (action이 "list" 등일 때)
  "reply": "사용자에게_보여줄_응답_메시지"
}

'title', 'titles', 'target' 필드는 'action'에 따라 선택적으로 사용됩니다.

예시:
1. 단일 항목 추가: "장보기 추가해줘"
   { "action": "add", "title": "장보기", "reply": "투두리스트에 '장보기'를 추가했습니다." }
2. 여러 항목 추가: "숙제랑 운동 추가해"
   { "action": "add_multiple", "titles": ["숙제", "운동"], "reply": "투두리스트에 다음 항목들을 추가했습니다:\\n- 숙제\\n- 운동" }
3. 특정 항목 삭제: "장보기 삭제해"
   { "action": "delete", "title": "장보기", "reply": "'장보기' 항목을 삭제했습니다." }
4. 여러 특정 항목 삭제: "회의 준비랑 보고서 작성 삭제해줘"
   { "action": "delete_multiple", "titles": ["회의 준비", "보고서 작성"], "reply": "다음 항목들을 삭제했습니다:\\n- 회의 준비\\n- 보고서 작성" }
5. 모든 항목 삭제: "모든 할일 삭제해줘"
   { "action": "delete_all", "target": "all", "reply": "모든 할일을 삭제했습니다." }
6. 특정 항목 완료/미완료 토글: "숙제 완료 처리해"
   { "action": "toggle", "title": "숙제", "reply": "'숙제' 항목의 완료 상태를 변경했습니다." }
7. 할 일 요약: "오늘 할 일 요약해줘"
   { "action": "summarize", "reply": "오늘의 할 일은 총 5개이며, 미완료된 항목은 3개입니다. 주요 미완료 항목은 다음과 같습니다:\\n- 보고서 작성\\n- 팀 회의 준비" }
8. 할 일 목록 보기 (전체, 미완료, 완료): "미완료된 할 일 목록 보여줘"
   { "action": "list", "target": "pending", "reply": "미완료된 할 일 목록입니다:\\n- 보고서 작성\\n- 팀 회의 준비\\n- 이메일 확인" }
9. 도움말: "내가 뭘 할 수 있는지 알려줘" 또는 "도움말"
   { "action": "help", "reply": "제가 할 수 있는 작업은 다음과 같습니다:\\n- 할 일 추가\\n- 여러 할 일 추가\\n- 특정 할 일 삭제\\n- 여러 특정 할 일 삭제\\n- 모든 할 일 삭제\\n- 할 일 상태 변경\\n- 할 일 요약\\n- 할 일 목록 보기\\n어떤 작업을 도와드릴까요?" }

사용자의 다양한 표현을 이해하고 위 형식에 맞춰 JSON을 생성해주세요. 'reply' 필드에는 사용자에게 전달할 최종 메시지를 포함해야 합니다.
"""


@app.route("/chatgpt", methods=["POST"])
def chat_with_gpt():
    data = request.get_json()
    if not data or "message" not in data:
        return (
            jsonify({"success": False, "error": "메시지가 제공되지 않았습니다."}),
            400,
        )

    user_message = data["message"]
    print(f"사용자 입력: {user_message}")  # 사용자 입력 출력

    try:
        api_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )

        if api_response.choices and len(api_response.choices) > 0:
            content = api_response.choices[0].message.content
            print(f"OpenAI 출력: {content}")  # OpenAI 출력
            return jsonify({"success": True, "content": content})
        else:
            return jsonify({"success": False, "error": "ChatGPT 응답이 없습니다."}), 500

    except Exception as e:
        print(f"오류: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
