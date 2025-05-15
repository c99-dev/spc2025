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

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

loader = TextLoader("./my-docs.txt", encoding="utf-8")
documents = loader.load()

documents = [
    Document(page_content=doc.page_content, metadata={"source": "novel"})
    for doc in documents
]

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

만약, 정보가 없으면 모른다고 답변해줘. 정보가 있으면, 정보를 가져온 출처를 알려줘.
질문: {question}

답변을 작성하고 마지막에 "출처: "라고 해서 문서의 출처를 적어줘.
"""

prompt = ChatPromptTemplate.from_template(template)

chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | llm

# response = chain.invoke("싱가폴의 유명한 관광지를 알려주시오")
# print(response.content)


def answer_question(question):
    response = chain.invoke(question)
    if "출처:" in response.content:
        answer, source = response.content.split("출처:")
    else:
        answer = response.content.strip()
        source = "출처 정보를 찾을 수 없습니다."
    return f"질문: {question}\n답변: {answer.strip()}\n출처: {source.strip()}"


print(answer_question("싱가폴의 유명한 관광지를 알려줘"))
print("-" * 50)
print(answer_question("이안의 캐릭터에 대해 설명해줘"))
