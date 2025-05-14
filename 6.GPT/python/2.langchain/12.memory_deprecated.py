from dotenv import load_dotenv

from langchain_openai import ChatOpenAI

from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

memory = ConversationBufferMemory()

conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
)


def chat(message):
    response = conversation.predict(input=message)
    return response


print(chat("안녕하세요"))
print(chat("오늘 날씨는 어떤가요?"))
print(chat("근데 우리 무슨 얘기하고 있었지?"))
