import openai
import httpx
import os
import traceback
import json
from flask import current_app

_client = None


def _get_openai_client():
    global _client
    if _client is None:
        try:
            api_key = current_app.config.get("OPENAI_API_KEY")
            if not api_key:
                return None

            api_key_display = (
                f"{api_key[:5]}...{api_key[-4:]}"
                if api_key and len(api_key) > 9
                else "API 키 없음"
            )
            current_app.logger.info(
                f"OpenAI 클라이언트 초기화 시도 중... (API 키: {api_key_display})"
            )

            if "SSL_CERT_FILE" in os.environ:
                del os.environ["SSL_CERT_FILE"]

            http_client = httpx.Client(verify=True)
            _client = openai.OpenAI(api_key=api_key, http_client=http_client)
            current_app.logger.info("OpenAI 클라이언트 초기화 완료.")
        except openai.AuthenticationError as e:
            current_app.logger.error(f"OpenAI 인증 오류 (API 키 확인 필요): {e}")
            _client = None
            return None
        except openai.APIConnectionError as e:
            current_app.logger.error(f"OpenAI API 연결 오류: {e}")
            _client = None
            return None
        except Exception as e:
            current_app.logger.error(
                f"OpenAI 클라이언트 초기화 중 예상치 못한 오류 발생: {e.__class__.__name__}: {e}"
            )
            current_app.logger.error(traceback.format_exc())
            _client = None
            return None
    return _client


def generate_chat_stream(messages):
    client = _get_openai_client()
    if not client:
        yield f"data: {json.dumps({'error': 'OpenAI 클라이언트를 사용할 수 없습니다. 설정을 확인하세요.'}, ensure_ascii=False)}\n\n"
        return

    try:
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            stream=True,
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                yield f"data: {json.dumps({'message': content}, ensure_ascii=False)}\n\n"

    except openai.RateLimitError as e:
        error_msg = f"OpenAI API 요청 제한 초과: {str(e)}"
        current_app.logger.warning(f"{error_msg}\n{traceback.format_exc()}")
        yield f"data: {json.dumps({'error': '현재 요청량이 많아 잠시 후 다시 시도해주세요.'}, ensure_ascii=False)}\n\n"
    except openai.APIError as e:
        error_msg = f"OpenAI API 오류: {str(e)}"
        current_app.logger.error(f"{error_msg}\n{traceback.format_exc()}")
        yield f"data: {json.dumps({'error': error_msg}, ensure_ascii=False)}\n\n"
    except Exception as e:
        error_msg = f"서비스 내부 오류: {str(e)}"
        current_app.logger.error(
            f"서비스 오류 발생: {str(e)}\n{traceback.format_exc()}"
        )
        yield f"data: {json.dumps({'error': error_msg}, ensure_ascii=False)}\n\n"
