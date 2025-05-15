# 랭체인 라이브러리 불러오기
import os
from dotenv import load_dotenv
from langchain_openai import (
    OpenAIEmbeddings,
)

from langchain_community.document_loaders import PyPDFLoader

from langchain.text_splitter import (
    CharacterTextSplitter,
)
from langchain_community.vectorstores import Chroma

import sqlite3

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers.string import StrOutputParser

load_dotenv()

PERSIST_DIR = "./chroma_db"


# 파일 경로를 받아서 백터 DB를 생성하는 함수
# PDF 파일을 읽고, 텍스트를 청크로 나누고, 벡터 DB에 저장하는 함수
# 만약 백터 DB가 이미 존재하면, 기존 DB를 불러오는 함수
def create_vector_db(file_path):
    # pdf 파일인지 확인
    if not file_path.endswith(".pdf"):
        raise ValueError("PDF 파일만 지원합니다.")

    if check_collection_exists(PERSIST_DIR, os.path.basename(file_path)):
        print(f"'{os.path.basename(file_path)}' 컬렉션이 이미 존재합니다.")
        return

    loader = PyPDFLoader(file_path)
    pages = loader.load()

    print("페이지 수:", len(pages))
    # print("샘플 1 페이지", pages[0].page_content)

    for doc in pages:
        doc.metadata["source"] = os.path.basename(file_path)
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
        collection_name=os.path.basename(file_path),
        persist_directory=PERSIST_DIR,
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


def answer_question(question):
    # sqlite DB 파일에서 select하여 모든 collection 이름을 가져옴
    db_file = os.path.join(PERSIST_DIR, "chroma.sqlite3")

    if not os.path.exists(db_file):
        print(f"DB 파일이 존재하지 않습니다: {db_file}")
        return

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM collections")
    collections = cursor.fetchall()
    conn.close()

    if not collections:
        print("DB에 컬렉션이 없습니다.")
        return

    # 컬렉션 이름을 리스트로 변환
    collection_names = [collection[0] for collection in collections]

    embeddings = OpenAIEmbeddings()

    stores = {
        name: Chroma(
            persist_directory=PERSIST_DIR,
            embedding_function=embeddings,
            collection_name=name,
        )
        for name in collection_names
    }

    llm = ChatOpenAI(model="gpt-4o-mini")
    prompt = ChatPromptTemplate.from_template(
        """
    다음 문서들을 참고하여 질문에 답변해주세요:

    문서들:
    {context}

    질문:
    {question}
    """
    )

    chain = prompt | llm | StrOutputParser()

    def ask(question):
        docs = []
        for store in stores.values():
            docs.extend(store.similarity_search(question, k=2))
        context = "\n\n".join([doc.page_content for doc in docs])
        response = chain.invoke({"context": context, "question": question})
        return response

    return ask(question)
