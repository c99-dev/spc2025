from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import os
import certifi
import requests

# .env 파일에서 환경 변수 로드
load_dotenv(dotenv_path="./../../.env")
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# SSL 인증서 경로 설정 (환경 변수)
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
os.environ["SSL_CERT_FILE"] = certifi.where()

# 방법 1: 환경 변수 설정 후 일반적인 클라이언트 생성
try:
    client = InferenceClient(model="mistralai/Mistral-7B-Instruct-v0.3", token=hf_token)

    # 한국어 프롬프트
    prompt = "너 한국말 할 줄 알아?"

    # 텍스트 생성 요청
    response = client.text_generation(prompt)
    print("응답:", response)
except Exception as e:
    print(f"방법 1 실패: {e}")

    # 방법 2: requests 세션을 사용하여 직접 API 호출
    try:
        print("\n방법 2 시도: requests 직접 사용")
        # Hugging Face API 엔드포인트
        api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

        # 헤더 설정
        headers = {"Authorization": f"Bearer {hf_token}"}

        # 요청 데이터
        payload = {"inputs": prompt}

        # 인증서 경로 직접 지정하여 요청
        response = requests.post(
            api_url,
            headers=headers,
            json=payload,
            verify=certifi.where(),  # 인증서 경로 지정
        )

        # 응답 확인
        if response.status_code == 200:
            print("응답:", response.json())
        else:
            print(f"API 오류: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"방법 2 실패: {e}")
        print("\n추가 해결 방법:")
        print("1. pip install --upgrade huggingface_hub certifi requests")
        print("2. 보안상 권장하지 않지만 테스트를 위해 verify=False 시도:")
        print(
            "   response = requests.post(api_url, headers=headers, json=payload, verify=False)"
        )
        print("3. 회사 네트워크를 사용 중이라면 프록시 설정 필요:")
        print("   os.environ['HTTPS_PROXY'] = '프록시_주소:포트'")
