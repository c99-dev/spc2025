from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnablePassthrough

load_dotenv()

# 입력값: "주제"
# -> 이 상품/서비스를 갖는 회사명을 만들고
# -> 그 회사명을 기반으로, 회사의 슬로건(캐치프레이즈)를 만들 것


chat_prompt1 = PromptTemplate(
    input_variables=["product"],
    template="너는 회사 이름을 전문적으로 짓는 작명가야, 다음 상품/서비스에 맞는 회사 이름을 지어줘. 한 단어로 추가 설명 없이: \n\n[상품명]: {product}",
)

chat_prompt2 = PromptTemplate(
    input_variables=["company_name"],
    template="너는 회사 슬로건을 전문적으로 짓는 작명가야, 다음 회사 이름에 맞는 슬로건(또는 catch-phrase)을 지어줘: \n\n[회사명]: {company_name}",
)

chat_prompt3 = PromptTemplate(
    input_variables=["product", "company_name"],
    template="이 회사를 잘 소개할 수 있는 소개 문장 글을 작성해줘. 200자 이내 분량으로 작성해줘: \n\n[상품명]: {product} [회사명]: {company_name}",
)

llm = OpenAI(model="gpt-3.5-turbo-instruct", temperature=0.9, max_tokens=2000)
# llm = OpenAI(model="gpt-4o", temperature=2.0)

# chain1을 assign하여 RunnableLambda를 사용하여 체인 생성
chain1 = (
    {"product": lambda x: x["product"]}
    | RunnablePassthrough.assign(
        company_name=lambda x: llm.invoke(
            chat_prompt1.format(product=x["product"])
        ).strip()
    )
    | RunnablePassthrough.assign(
        catch_phrase=lambda x: llm.invoke(
            chat_prompt2.format(company_name=x["company_name"])
        ).strip()
    )
    | RunnablePassthrough.assign(
        introduction=lambda x: llm.invoke(
            chat_prompt3.format(product=x["product"], company_name=x["company_name"])
        ).strip()
    )
)

response = chain1.invoke(
    {
        "product": "AI 기반의 github issue 스코어링 서비스",
    }
)
print("회사명", response["company_name"])
print("슬로건", response["catch_phrase"])
print("회사소개\n", response["introduction"])
