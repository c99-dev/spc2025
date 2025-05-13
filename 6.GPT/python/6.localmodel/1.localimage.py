import torch
from diffusers import FluxPipeline
from huggingface_hub import login
from dotenv import load_dotenv
import os

load_dotenv()

login(token=os.getenv("HUGGINGFACEHUB_API_TOKEN"))

# GPU 사용 가능 여부 확인 및 장치 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# FLUX.1-dev 모델 로드
# torch_dtype을 bfloat16으로 설정하여 메모리 사용량을 줄일 수 있습니다 (GPU 지원 시).
# 로컬에 모델을 다운로드 받아 사용하려면 cache_dir을 지정할 수 있습니다.
try:
    pipe = FluxPipeline.from_pretrained(
        "black-forest-labs/FLUX.1-dev",
        torch_dtype=(
            torch.bfloat16 if device.type == "cuda" else torch.float32
        ),  # CPU에서는 float32 사용
        # cache_dir="./flux_cache" # 원하는 경로로 지정
    )
    pipe.to(device)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    print(
        "Please ensure you have accepted the model's terms on Hugging Face Hub and are logged in if required."
    )
    exit()

# 프롬프트 설정
prompt = "A photorealistic image of a cat wearing a small wizard hat, sitting on a pile of ancient books."

# 이미지 생성
# num_inference_steps 값을 조절하여 생성 품질과 속도 사이의 균형을 맞출 수 있습니다.
try:
    image = pipe(
        prompt=prompt,
        num_inference_steps=50,  # 기본값은 50, 필요에 따라 조절
        guidance_scale=7.0,  # 프롬프트 충실도, 기본값은 7.0
        output_type="pil",  # PIL Image 객체로 결과 받기
    ).images[0]

    # 생성된 이미지 저장
    image.save("flux_dev_generated_image.png")
    print("Image generated and saved as flux_dev_generated_image.png")

    # (선택) 생성된 이미지 보기 (예: Jupyter Notebook 환경)
    # from IPython.display import display
    # display(image)

except Exception as e:
    print(f"Error during image generation: {e}")
