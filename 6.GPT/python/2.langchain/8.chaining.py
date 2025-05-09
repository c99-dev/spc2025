from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda
from langchain_core.output_parsers import CommaSeparatedListOutputParser
from dotenv import load_dotenv

load_dotenv()

chat_prompt1 = ChatPromptTemplate.from_template(
    "너는 요리사야, 다음 질문에 대답해줘: \n\n[질문]: {question}",
)

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.5)

chain1 = chat_prompt1 | llm | RunnableLambda(lambda x: {"answer": x.content})

response = chain1.invoke({"question": "김치는 어떻게 만들어?"})["answer"]

print("답변: ", response)

system_template = "너는 전문 번역가야. 다음 글을 보고 {input_language}에서 {output_language}로 번역해줘."
system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)
human_message_prompt = HumanMessagePromptTemplate.from_template("{text}")

chat_prompt2 = ChatPromptTemplate.from_messages(
    [
        system_message_prompt,
        human_message_prompt,
    ]
)

chain2 = chat_prompt2 | llm | RunnableLambda(lambda x: {"translation": x.content})

response2 = chain2.invoke(
    {
        "input_language": "영어",
        "output_language": "한국어",
        "text": "Hello, how are you?",
    }
)["translation"]
print("번역결과: ", response2)

print("-" * 50)

chain3 = chat_prompt2 | llm | CommaSeparatedListOutputParser()

response3 = chain3.invoke(
    {
        "input_language": "영어",
        "output_language": "한국어",
        "text": "Hello, how are you?",
    }
)
print("번역결과: ", response3)
