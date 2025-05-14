from dotenv import load_dotenv
from langchain_openai import (
    ChatOpenAI,
    OpenAIEmbeddings,
)

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
)
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

loader = TextLoader("./my-docs.txt", encoding="utf-8")

documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
texts = text_splitter.split_documents(documents)

# print("청크1", texts[0])
# print("청크2", texts[1])

embeddings = OpenAIEmbeddings()

store = Chroma.from_documents(texts, embeddings, collection_name="novel")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

retriever = store.as_retriever()

template = """
다음 내용을 참고해서 사용자의 질문에 답변하시오:
{context}

질문: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | llm

response = chain.invoke("싱가폴의 유명한 관강지를 알려주시오")

print(response.content)
