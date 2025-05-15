import os
from dotenv import load_dotenv
from langchain_openai import (
    ChatOpenAI,
    OpenAIEmbeddings,
)

from langchain_community.document_loaders import PyPDFLoader

from langchain.text_splitter import (
    CharacterTextSplitter,
)
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
import sqlite3

load_dotenv()

PERSIST_DIR = "./chroma_db"
COLLECTION_NAME = "python_secure_coding_guide"
pdf_filename = "./PDF/Python_시큐어코딩_가이드(2023년_개정본).pdf"


def create_vector_db():

    loader = PyPDFLoader(pdf_filename)
    pages = loader.load()

    print("페이지 수:", len(pages))
    # print("샘플 1 페이지", pages[0].page_content)

    for doc in pages:
        doc.metadata["source"] = os.path.basename(pdf_filename)
        if "page" in doc.metadata:
            doc.metadata["page"] = doc.metadata["page"]

    text_splitter = CharacterTextSplitter(
        separator="\n\n", chunk_size=2000, chunk_overlap=200
    )
    texts = text_splitter.split_documents(pages)

    embeddings = OpenAIEmbeddings()

    store = Chroma.from_documents(
        texts,
        embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=PERSIST_DIR,
    )
    return store


def load_vector_db():
    embeddings = OpenAIEmbeddings()

    store = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME,
    )
    return store


def check_collection_exists(persist_dir, collection_name):
    if not os.path.exists(persist_dir):
        print(f"DB 디렉토리가 존재하지 않습니다: {persist_dir}")
        return False

    # sqlite DB 파일에서 select하여 collection이 존재하는지 확인
    db_file = os.path.join(persist_dir, "chroma.sqlite3")
    if not os.path.exists(db_file):
        print(f"DB 파일이 존재하지 않습니다: {db_file}")
        return False

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM collections WHERE name=?",
        (collection_name,),
    )
    exists = cursor.fetchone() is not None
    conn.close()
    return exists


if check_collection_exists(PERSIST_DIR, COLLECTION_NAME):
    print("컬렉션이 존재합니다.")
    store = load_vector_db()
else:
    print("컬렉션이 존재하지 않습니다. 컬렉션을 생성합니다.")
    store = create_vector_db()

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

retriever = store.as_retriever()

template = """
다음 내용을 참고해서 사용자의 질문에 답변하시오:
{context}

만약, 정보가 없으면 모른다고 답변해줘. 정보가 있으면, 정보를 가져온 출처를 알려줘.
내용이 길 경우 리스트 형태로 번호를 매겨서 답변해줘.
질문: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | llm


def answer_question(question):
    response = chain.invoke(question)
    if "출처:" in response.content:
        answer, source = response.content.split("출처:", 1)
    else:
        answer = response.content.strip()
        source = "출처 정보를 찾을 수 없습니다."
    return f"질문: {question}\n답변: {answer.strip()}\n출처: {source.strip()}"


print(answer_question("싱가폴의 유명한 관광지를 알려줘"))
print("-" * 50)
print(answer_question("python for 문 관 보안 내용을 알려줘"))
print("-" * 50)
print(answer_question("sql injection 방어 방법을 알려줘"))
