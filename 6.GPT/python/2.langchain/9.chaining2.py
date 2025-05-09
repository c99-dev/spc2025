from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnableLambda

load_dotenv()

# 입력값: "주제"
# -> 이 상품/서비스를 갖는 회사명을 만들고
# -> 그 회사명을 기반으로, 회사의 슬로건(캐치프레이즈)를 만들 것


chat_prompt1 = PromptTemplate(
    input_variables=["product"],
    template="너는 회사 이름을 전문적으로 짓는 작명가야, 다음 상품/서비스에 맞는 회사 이름을 지어줘: \n\n[상품명]: {product}",
)

chat_prompt2 = PromptTemplate(
    input_variables=["company_name"],
    template="너는 회사 슬로건을 전문적으로 짓는 작명가야, 다음 회사 이름에 맞는 슬로건(또는 catch-phrase)을 지어줘: \n\n[회사명]: {company_name}",
)

llm = OpenAI(model="gpt-3.5-turbo-instruct", temperature=2.0)
# llm = OpenAI(model="gpt-4o", temperature=2.0)

chain1 = (
    chat_prompt1
    | llm
    | RunnableLambda(lambda x: {"company_name": x.strip()})
    | chat_prompt2
    | llm
    | RunnableLambda(lambda x: {"slogan": x.strip()})
)

response = chain1.invoke(
    {
        "product": "AI 기반의 github issue 스코어링 서비스",
    }
)
print(response)
