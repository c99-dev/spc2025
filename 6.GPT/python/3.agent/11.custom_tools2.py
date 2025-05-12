from dotenv import load_dotenv
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI
from langchain.tools import tool

load_dotenv()


@tool
def get_current_weather(location: str) -> str:
    """특정 위치의 현재 날짜 정보를 가져옵니다."""
    weather_data = {
        "서울": "서울의 현재 날씨는 맑음입니다.",
        "부산": "부산의 현재 날씨는 흐림입니다.",
        "제주": "제주의 현재 날씨는 비입니다.",
    }

    return weather_data.get(location, "{location}의 날씨 정보를 찾을 수 없습니다.")


@tool
def get_population(city: str) -> str:
    """특정 도시의 인구 정보를 가져옵니다."""
    population_data = {
        "서울": "서울의 인구는 약 1000만 명입니다.",
        "부산": "부산의 인구는 약 340만 명입니다.",
        "인천": "인천의 인구는 약 290만 명입니다.",
        "대구": "대구의 인구는 약 250만 명입니다.",
    }

    return population_data.get(city, "{city}의 인구 정보를 찾을 수 없습니다.")


tools = [get_current_weather, get_population]

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

result = agent.invoke({"input": "서울의 현재 날씨는? 부산의 인구는?"})
print(result)
