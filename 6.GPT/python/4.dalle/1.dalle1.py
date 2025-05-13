from dotenv import load_dotenv
from openai import OpenAI
import urllib
import os  # os 모듈 추가

load_dotenv()

client = OpenAI()

# 모델은 dall-e-2 OR dall-e-3
# 사이즈 v2: 최대사이즈 1024x1024, 보통 512x512, 256x256
# 사이즈 v3: 최소사이즈 1024x1024, 보통 1024x1024, 1024x1792, 1792x1024
# 품질 : standard or hd
# 갯수 : v2: 여러개 가능, v3: 1개밖에 안됨

response = client.images.generate(
    model="dall-e-3",
    prompt="A hyper-realistic, beautiful view of Waikiki Beach in Hawaii. Crystal-clear turquoise waters gently lap against the white sandy shore, with Diamond Head volcano in the distance. Palm trees sway in the breeze under a vibrant blue sky with a few fluffy white clouds. The beach is lively yet peaceful, with colorful beach umbrellas, surfers in the water, and people enjoying the sun. The overall scene is picturesque, tropical, and dreamlike.",
    size="1024x1024",
    quality="hd",
    n=1,
)

image_url = response.data[0].url
print(image_url)

# 이미지 다운로드 및 저장
# DATA 폴더가 스크립트 실행 위치에 생성되거나 이미 존재해야 합니다.
# 프로젝트 루트에 DATA 폴더를 만들고 싶다면 경로를 조정해야 합니다.
data_folder = os.path.join(os.path.dirname(__file__), "DATA")
if not os.path.exists(data_folder):
    os.makedirs(data_folder)
image_save_path = os.path.join(data_folder, "generated_image.png")
urllib.request.urlretrieve(image_url, image_save_path)
print(f"이미지가 {image_save_path}에 저장되었습니다.")
