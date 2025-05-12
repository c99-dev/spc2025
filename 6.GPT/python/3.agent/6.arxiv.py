from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import load_tools, initialize_agent, AgentType

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
tools = load_tools(["arxiv"], llm=llm)
agent = initialize_agent(
    tools,
    llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)
result = agent.invoke(
    {
        "input": "최근 프롬프트 엔지니어링 관련 논문을 찾아서 한국어로 요약해줘",
    }
)
print("결과: ", result["output"])
