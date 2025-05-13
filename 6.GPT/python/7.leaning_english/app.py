from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

app = Flask(__name__)

curriculums = {
    1: ["기초 인사", "간단한 문장", "동물 이름"],
    2: ["학교 생활", "가족 소개", "취미 활동"],
    3: ["음식 주문하기", "길 묻고 답하기", "날씨 표현"],
    4: ["미래 계획 말하기", "경험 이야기하기", "제안하고 답하기"],
    5: ["토론하기", "뉴스 기사 읽기", "복잡한 지시 이해하기"],
    6: ["문학 작품 감상", "사회 문제 토론", "학술적 글쓰기 기초"],
}


@app.route("/")
def hello_world():
    return render_template("home.html", grades=curriculums.keys())


@app.route("/grade/<int:grade>")
def grade(grade):
    if grade in curriculums:
        curriculum_list = curriculums[grade]
        return render_template(
            "grade.html",
            grade=grade,
            curriculums=curriculum_list,
            grades=curriculums.keys(),
        )
    else:
        return "해당 학년의 커리큘럼이 없습니다.", 404


@app.route("/grade/<int:grade>/<int:curriculum_id>", methods=["GET", "POST"])
def curriculum(grade, curriculum_id):
    if grade in curriculums and 0 <= curriculum_id < len(curriculums[grade]):
        curriculum_title = curriculums[grade][curriculum_id]
        if request.method == "POST":
            data = request.get_json()  # JSON 데이터 수신
            user_input = data.get("user_input")
            if not user_input:
                return jsonify({"error": "No input provided"}), 400

            try:
                client_response = client.chat.completions.create(  # API 호출 방식 수정
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": f"You are an English tutor. The student is in grade {grade}. The current topic is '{curriculum_title}'. Please respond to the user in English, keeping the conversation relevant to the topic and considering the student's grade level. If the user's input is not in English, gently guide them to use English.",
                        },
                        {"role": "user", "content": user_input},
                    ],
                    temperature=0.7,
                )
                chat_response = client_response.choices[0].message.content.strip()
                return jsonify({"response": chat_response})  # JSON 응답 반환
            except Exception as e:
                print(f"Error calling OpenAI API: {e}")
                return jsonify({"error": "Failed to get response from AI"}), 500

        # GET 요청 시 HTML 렌더링
        return render_template(
            "curriculum.html",
            grade=grade,
            curriculum_title=curriculum_title,
            grades=curriculums.keys(),
        )
    else:
        return "해당 커리큘럼을 찾을 수 없습니다.", 404


if __name__ == "__main__":
    app.run(debug=True)
