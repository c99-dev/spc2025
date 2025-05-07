from flask_restful import Resource


class ExampleResource(Resource):
    def get(self):
        """예시 GET 엔드포인트"""
        return {"message": "API 작동 중입니다"}, 200

    def post(self):
        """예시 POST 엔드포인트"""
        return {"message": "데이터가 성공적으로 처리되었습니다"}, 201
