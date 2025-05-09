from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent, AgentType


load_dotenv()

llm = OpenAI(temperature=0.9)

tools = load_tools(["human"])

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)
result = agent.run("너는 몇살이니?")
print(result)
