from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnableLambda

load_dotenv()

template = "다음 요청에 대한 이메일 초안을 작성하시오. 수신자 {recipient} 에게 다음 주제 {topic}에 대해 한글로 작성하시오."
prompt = PromptTemplate(
    input_variables=["recipient", "topic"],
    template=template,
)
llm = OpenAI(temperature=0.6, max_tokens=1000)
chain = prompt | llm | RunnableLambda(lambda x: {"email_body": x.strip()})

inputs = {
    "recipient": "고객",
    "topic": "신제품 출시",
}

result = chain.invoke(inputs)
print("이메일 내용:\n" + result["email_body"])

print("-" * 50)

recipients = ["고객", "직원", "파트너"]
topics = ["신제품 출시", "정기 회의", "연말 파티"]
inputs = {
    "recipient": recipients,
    "topic": topics,
}

for recipient, topic in zip(recipients, topics):
    result = chain.invoke({"recipient": recipient, "topic": topic})
    print(f"이메일 내용 ({recipient} - {topic}):\n" + result["email_body"])
    print("-" * 50)
