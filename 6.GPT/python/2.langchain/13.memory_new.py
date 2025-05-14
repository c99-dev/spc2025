from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

memory = ChatMessageHistory()

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "너는 친절한 비서야."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm


def chat(message):
    response = chain.invoke({"input": message, "history": memory.messages})
    memory.add_user_message(message)
    memory.add_ai_message(response.content)
    return response.content


print(chat("안녕하세요"))
print(chat("오늘 날씨는 어떤가요?"))
print(chat("근데 우리 무슨 얘기하고 있었지?"))
