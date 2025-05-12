from dotenv import load_dotenv
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI
from langchain.tools import tool

load_dotenv()


@tool
def add(query: str) -> int:
    """두 숫자를 더합니다. 형식: '숫자1 숫자2'"""
    query = query.replace("'", "").replace('"', "").strip()
    try:
        numbers = [int(num) for num in query.split() if num.isdigit()]
    except ValueError:
        raise ValueError("숫자를 찾을 수 없습니다.")
    return numbers[0] + numbers[1]


@tool
def subtract(query: str) -> int:
    """두 숫자를 뺍니다. 형식: '숫자1 숫자2'"""
    query = query.replace("'", "").replace('"', "").strip()
    try:
        numbers = [int(num) for num in query.split() if num.isdigit()]
    except ValueError:
        raise ValueError("숫자를 찾을 수 없습니다.")
    return numbers[0] - numbers[1]


@tool
def multiply(query: str) -> int:
    """두 숫자를 곱합니다. 형식: '숫자1 숫자2'"""
    query = query.replace("'", "").replace('"', "").strip()
    try:
        numbers = [int(num) for num in query.split() if num.isdigit()]
    except ValueError:
        raise ValueError("숫자를 찾을 수 없습니다.")
    return numbers[0] * numbers[1]


tools = [add, multiply]

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
)

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

result = agent.invoke(
    {"input": "5와 2를 더하고, 그 결과에서 3을 빼고, 다시 그 결과에 4를 곱하시오."}
)
print(result)
