from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnableLambda

load_dotenv()

template = "다음 요청에 대한 SQL 쿼리문을 한줄로 작성하시오. 설명 없이 오직 SQL 쿼리문만 작성하시오.\n\n요청: {request}"
prompt = PromptTemplate(
    input_variables=["request"],
    template=template,
)
llm = OpenAI(temperature=0.5, max_tokens=1200)
chain = prompt | llm | RunnableLambda(lambda x: {"sql": x.strip()})

inputs = {
    "request": """
    1. 고객 테이블에서 고객 ID, 이름, 이메일을 선택하시오.
    2. 주문 테이블에서 주문 ID, 고객 ID, 주문 날짜를 선택하시오.
    3. 고객 테이블과 주문 테이블을 고객 ID를 기준으로 조인하여 고객 이름과 주문 날짜를 선택하시오.
    4. 고객 이름이 'John'인 고객의 주문 날짜를 선택하시오.
    5. 주문 날짜가 '2023-01-01' 이후인 모든 주문을 선택하시오.
    """
}

result = chain.invoke(inputs)
print("SQL 쿼리문:\n" + result["sql"])
