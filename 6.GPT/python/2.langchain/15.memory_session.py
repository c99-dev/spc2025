from dotenv import load_dotenv
from uuid import uuid4

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers.string import StrOutputParser

from langchain_core.runnables.history import RunnableWithMessageHistory

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "너는 친절한 비서야."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm | StrOutputParser()

session_id = str(uuid4())

store = {}


def get_session_history(session_id):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


chain_with_memory = RunnableWithMessageHistory(
    chain,
    lambda session_id: get_session_history(session_id),
    input_messages_key="input",
    history_messages_key="history",
)


print(
    chain_with_memory.invoke(
        {"input": "안녕하세요"}, config={"configurable": {"session_id": session_id}}
    )
)
print(
    chain_with_memory.invoke(
        {"input": "오늘 날씨는 어떤가요?"},
        config={"configurable": {"session_id": session_id}},
    )
)
print(
    chain_with_memory.invoke(
        {"input": "근데 우리 무슨 얘기하고 있었지?"},
        config={"configurable": {"session_id": session_id}},
    )
)
