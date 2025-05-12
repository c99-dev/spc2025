from dotenv import load_dotenv
from langchain_community.utilities import WikipediaAPIWrapper, GoogleSerperAPIWrapper
from langchain_experimental.plan_and_execute import (
    PlanAndExecute,
    load_agent_executor,
    load_chat_planner,
)
from langchain_openai import ChatOpenAI
from langchain.chains import LLMMathChain
from langchain.tools import Tool

load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.5,
)

llm_math_chain = LLMMathChain.from_llm(llm=llm, verbose=True)
search = GoogleSerperAPIWrapper()
wikipedia = WikipediaAPIWrapper()

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Useful for when you need to answer questions about current events or find information that is not in the Wikipedia.",
    ),
    Tool(
        name="Wikipedia",
        func=wikipedia.run,
        description="Useful for when you need to find information that is in the Wikipedia.",
    ),
    Tool(
        name="Calculator",
        func=llm_math_chain.run,
        description="Useful for when you need to do some math calculations.",
    ),
]

# 계획 및 실행하기 위한 에이전트 정의
planner = load_chat_planner(
    llm=llm,
)
executor = load_agent_executor(
    llm=llm,
    tools=tools,
    verbose=True,
)
agent = PlanAndExecute(
    planner=planner,
    executor=executor,
    verbose=True,
)

prompt = "다음 하계 올림픽을 개최할 나라는?"
result = agent.invoke(prompt)
print(result)
