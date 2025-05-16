from flask import Flask

# 절대 임포트로 변경
from db_utils import init_db
from routes import configure_routes


app = Flask(__name__, static_folder="static")

# 필요한 경우 앱 설정 (config.py에서 관리하는 것이 더 좋음)
# app.config['OPENAI_API_KEY'] = OPENAI_API_KEY # 예시

# 라우트 설정 함수 호출
configure_routes(app)

if __name__ == "__main__":
    init_db()  # DB 초기화
    app.run(debug=True)
