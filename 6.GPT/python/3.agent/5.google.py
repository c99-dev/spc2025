from dotenv import load_dotenv
from langchain_openai import OpenAI
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent, AgentType

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda

# 환경 변수 로드
load_dotenv()

# LLM 초기화
llm = OpenAI(temperature=0.7)

tools = load_tools(["google-search"])

# 에이전트 초기화
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

prompt1 = "오늘 한국 서울의 날씨는 어떤가요?"

prompt2 = PromptTemplate(
    input_variables=["input"],
    template="너는 한국어 번역가야, 다음 문장을 한국어로 번역해줘: \n\n[영어]: {input}",
)

# 체인으로 묶기
chain = (
    agent
    | RunnableLambda(lambda x: {"input": x["output"]})
    | prompt2
    | llm
    | RunnableLambda(lambda x: {"translated_result": x})
)

response = chain.invoke(prompt1)
print(response)
