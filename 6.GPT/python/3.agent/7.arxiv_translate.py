from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import load_tools, initialize_agent, AgentType
from langchain_core.prompts import PromptTemplate  # PromptTemplate 임포트
from langchain_core.runnables import RunnableLambda

# 환경 변수 로드
load_dotenv()

# LLM 및 도구 초기화
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
tools = load_tools(["arxiv"], llm=llm)
agent_executor = initialize_agent(
    tools,
    llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

# --- 1단계: ArXiv에서 논문 검색 및 요약 ---
print("--- ArXiv에서 논문 검색 및 요약 진행 중 ---")
agent_result = agent_executor.invoke(
    {
        "input": "최근 프롬프트 엔지니어링 관련 논문을 찾아서 영어로 요약해줘",
    }
)
summary_to_translate = agent_result["output"]
print("요약 결과 (번역 전): ", summary_to_translate)


# --- 2단계: 요약된 내용 번역 ---

# 1. 번역 프롬프트 템플릿 작성
translate_prompt_template = PromptTemplate.from_template(
    "다음 문장을 한국어로 번역해줘:\n\n{sentence}"
)

# 2. 번역 체인 정의

translation_chain = (
    translate_prompt_template
    | llm
    | RunnableLambda(lambda x: {"translation": x.content.strip()})
)

# 3. 번역 체인 실행
print("\n--- 요약 내용 번역 진행 중 ---")
translation_response = translation_chain.invoke(
    {
        "sentence": summary_to_translate,
    }
)

# 4. 최종 번역 결과 출력
print("번역 결과: ", translation_response["translation"])
