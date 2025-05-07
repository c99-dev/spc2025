import json
from flask import current_app
from flask_sse import sse


def send_sse_event(event_type, data, channel="messages"):
    """SSE 이벤트 발송 함수"""
    try:
        sse.publish(data=json.dumps(data), type=event_type, channel=channel)
        current_app.logger.info(f"SSE 이벤트 발송: {event_type}")
        return True
    except Exception as e:
        current_app.logger.error(f"SSE 이벤트 발송 실패: {str(e)}")
        return False
