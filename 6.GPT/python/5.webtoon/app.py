from flask import Flask, request, render_template
from dotenv import load_dotenv
from openai import OpenAI
import concurrent.futures

load_dotenv()

app = Flask(__name__)
client = OpenAI()


def summarize_text(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "당신은 주어진 텍스트를 웹툰으로 요약하는 데 도움을 주는 어시스턴트입니다.",
            },
            {
                "role": "user",
                "content": f"다음 텍스트를 웹툰을 위한 5개의 문장으로 요약해 주세요: {text}",
            },
        ],
        temperature=0.7,
    )
    summaries = response.choices[0].message.content.strip().split(".")
    print("문장 요약 결과:", summaries)
    return summaries[:5]


def generate_image(prompt):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
    )
    image_url = response.data[0].url
    print("생성된 이미지 URL:", image_url)
    return image_url


@app.route("/", methods=["GET", "POST"])
def hello_world():
    if request.method == "POST":
        text = request.form.get("text")
        prompts = summarize_text(text)

        images = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # 각 프롬프트에 대해 generate_image 함수를 병렬로 실행합니다.
            future_to_prompt = {
                executor.submit(generate_image, prompt): prompt for prompt in prompts
            }
            for future in concurrent.futures.as_completed(future_to_prompt):
                prompt = future_to_prompt[future]
                try:
                    image_url = future.result()
                    images.append(image_url)
                except Exception as exc:
                    print(f"{prompt} 생성 중 예외 발생: {exc}")
                    images.append(None)

        return render_template("index.html", prompts=prompts, images=images)

    return render_template("index.html", prompts=None, images=None)


if __name__ == "__main__":
    app.run(debug=True)
