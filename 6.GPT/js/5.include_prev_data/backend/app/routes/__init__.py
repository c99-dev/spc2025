from flask import Blueprint
from flask_restful import Api

# API 블루프린트 생성
api_bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(api_bp)


# 라우트 등록 함수
def register_routes(app):
    # 채팅 라우트 등록
    from .chat_route import create_chat_routes

    create_chat_routes(app)

    # 여기에 리소스 등록
    from .example_route import ExampleResource

    api.add_resource(ExampleResource, "/example")

    # 블루프린트 등록
    app.register_blueprint(api_bp)
