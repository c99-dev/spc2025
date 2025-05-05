from flask import Flask
from flask_cors import CORS
from .config import Config


def create_app():
    """애플리케이션 팩토리 함수"""
    # Flask 앱 생성
    app = Flask(__name__)

    # 설정 로드
    app.config.from_object(Config)

    # CORS 설정
    CORS(
        app,
        resources={
            r"/api/*": {"origins": Config.CORS_ORIGINS},
            r"/chat/stream": {"origins": Config.CORS_ORIGINS},
        },
    )

    # 라우트 등록
    from .routes import register_routes

    register_routes(app)

    return app
