from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_core.runnables import RunnableLambda
from dotenv import load_dotenv


load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

tools = load_tools(["google-search"])

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True,
)


def smart_router(input):
    user_input = input["input"]

    keywords = ["날씨", "정치", "경제", "문화", "스포츠", "2025년"]
    if any(keyword in user_input for keyword in keywords):
        print("[판단] Agent 사용 필요함")
        # 에이전트 호출
        agent_response = agent.invoke({"input": user_input})
        return {"output": agent_response["output"]}
    else:
        print("[판단] LLM 직접 호출")
        response = llm.invoke(user_input)
        return {
            "output": response.content.strip(),
        }


def smart_new_router(input):
    user_input = input["input"]

    judge_prompt = f"""
    너는 사용자의 질문에 대해 에이전트를 사용할지, 아니면 LLM을 직접 호출할지를 판단하는 역할을 맡고 있어.
    최신 정보를 요청하거나 니가 사전 지식으로 알 수 없는 질문에 대해서는 에이전트를 사용해야 해.
    오늘 같은 현재 시점을 물어보는 경우, 오늘 날짜 구글 검색을 통해 확인한 후 그 결과를 바탕으로 판단해줘.
    다음 질문을 보고 에이전트를 사용할지를 "yes" or "no"로 설명 없이 판단해줘.
    
    사용자 질문: {user_input}
    """

    judge_response = llm.invoke(judge_prompt).content.strip().lower()
    print(f"[판단] {judge_response}")
    if judge_response == "yes":
        print("[판단] Agent 사용 필요함")
        # 에이전트 호출
        agent_response = agent.invoke({"input": user_input})
        return {"output": agent_response["output"]}
    else:
        print("[판단] LLM 직접 호출")
        response = llm.invoke(user_input)
        return {
            "output": response.content.strip(),
        }


chain = RunnableLambda(smart_new_router)

inputs = [
    {
        "input": "서울의 오늘 날씨는 어때?",
    },
    {
        "input": "GPT-4o 모델은 어떤 특징이 있어?",
    },
    {
        "input": "2025년 미국 대통령은 누구야?",
    },
    {
        "input": "AI는 우리 삶에 어떤 영향을 미칠까?",
    },
]

for input_data in inputs:
    result = chain.invoke(input_data)
    print("질문: ", input_data["input"])
    print("답변: ", result["output"])
    print("-" * 50)
