from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

prompt = ChatPromptTemplate.from_messages([("human", "{input}")])

chain = prompt | llm


def chat(message):
    response = chain.invoke({"input": message})
    return response.content


print(chat("안녕하세요"))
print(chat("오늘 날씨는 어떤가요?"))
print(chat("근데 우리 무슨 얘기하고 있었지?"))
