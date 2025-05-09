from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent, AgentType

load_dotenv()

llm = OpenAI(temperature=0.2)

tools = load_tools(["wikipedia"])

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)
result = agent.run("인공지능의 역사에 대해서 간략히 설명해줘. translate to Korean")
print(result)
