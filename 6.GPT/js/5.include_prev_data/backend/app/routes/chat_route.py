from flask import Response, request, stream_with_context, current_app
import json


from ..services import openai_service


def stream_response_generator():
    """요청을 받아 서비스 호출 후 스트리밍 응답을 생성하는 제너레이터"""
    try:
        data = request.get_json()

        if not data or "messages" not in data or not isinstance(data["messages"], list):
            yield f"data: {json.dumps({'error': '올바른 형식의 메시지 목록(messages)이 필요합니다'}, ensure_ascii=False)}\n\n"
            return

        messages = data["messages"]

        if not messages or not messages[-1].get("content", "").strip():
            yield f"data: {json.dumps({'error': '메시지 목록이 비어있거나 마지막 메시지가 비어있습니다'}, ensure_ascii=False)}\n\n"
            return

        for chunk in openai_service.generate_chat_stream(messages):
            yield chunk

    except Exception as e:

        current_app.logger.error(f"라우트 처리 중 오류 발생: {str(e)}")

        yield f"data: {json.dumps({'error': '요청 처리 중 오류가 발생했습니다.'}, ensure_ascii=False)}\n\n"


def create_chat_routes(app):
    """채팅 라우트 등록 함수"""

    @app.route("/chat/stream", methods=["POST"])
    def chat_stream():
        """채팅 스트리밍 엔드포인트"""
        headers = {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        }

        return Response(
            stream_with_context(stream_response_generator()),
            mimetype="text/event-stream",
            headers=headers,
        )
