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
        return "데이터베이스가 존재하지 않습니다."

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM collections")
    collections = cursor.fetchall()
    conn.close()

    if not collections:
        print("DB에 컬렉션이 없습니다.")
        return "데이터베이스에 문서가 없습니다."

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
        # 모든 문서와 유사도 점수를 저장할 리스트
        all_docs_with_scores = []

        # 각 컬렉션에서 검색 결과와 점수 수집
        for name, store in stores.items():
            docs_with_scores = store.similarity_search_with_score(question, k=1000)
            all_docs_with_scores.extend(docs_with_scores)

        # 유사도 점수를 기준으로 내림차순 정렬 (점수가 낮을수록 더 유사함)
        all_docs_with_scores.sort(key=lambda x: x[1])

        # 상위 5개만 사용하기
        top_docs_with_scores = all_docs_with_scores[:5]

        # 답변 생성을 위한 문서 내용만 추출
        docs_for_query = [doc for doc, _ in top_docs_with_scores]
        context = "\n".join([doc.page_content for doc in docs_for_query])

        # 답변 생성
        response = chain.invoke({"context": context, "question": question})

        # 참고한 문서와 유사도 정보 구성
        reference_info = []
        for doc, score in top_docs_with_scores:
            source = doc.metadata.get("source", "알 수 없는 출처")
            page = doc.metadata.get("page", "페이지 정보 없음")
            similarity = 1.0 - score  # 유사도 점수 변환 (1에 가까울수록 더 유사함)
            reference_info.append(
                f"📄 문서: {source}, 페이지: {page}, 유사도: {similarity:.2%}"
            )

        # 최종 응답 구성 (개행 추가)
        final_response = f"{response}\n\n"
        final_response += "---\n\n"
        final_response += "# 참고한 문서 정보:\n"
        final_response += "\n".join(reference_info)

        # HTML 태그로 개행 적용
        final_response = final_response.replace("\n", "<br>")

        return final_response

    return ask(question)


def list_files(directory):
    try:
        files = os.listdir(directory)
        return files
    except FileNotFoundError:
        print(f"디렉토리가 존재하지 않습니다: {directory}")
        return []


def delete_file(file_path):
    # 파일 이름 추출
    file_name = os.path.basename(file_path)

    try:
        # Chroma 라이브러리 사용하여 컬렉션 삭제
        from langchain_community.vectorstores import Chroma
        import shutil
        import sqlite3

        embeddings = OpenAIEmbeddings()

        # 컬렉션 ID 조회
        db_file = os.path.join(PERSIST_DIR, "chroma.sqlite3")
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM collections WHERE name=?", (file_name,))
        collection_id = cursor.fetchone()

        # Chroma 인스턴스 생성 및 컬렉션 삭제
        db = Chroma(
            persist_directory=PERSIST_DIR,
            embedding_function=embeddings,
            collection_name=file_name,
        )
        db.delete_collection()

        # 컬렉션 ID가 있으면 해당 폴더 삭제
        if collection_id:
            collection_folder = os.path.join(PERSIST_DIR, collection_id[0])
            if os.path.exists(collection_folder):
                shutil.rmtree(collection_folder)
                print(f"컬렉션 폴더 '{collection_id[0]}'이 삭제되었습니다.")

        conn.close()
        print(f"컬렉션 '{file_name}'이 성공적으로 삭제되었습니다.")

        # 로컬 파일 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"파일 '{file_path}'이 성공적으로 삭제되었습니다.")
            return True
        else:
            print(f"파일 '{file_path}'이 존재하지 않습니다.")
            return False
    except Exception as e:
        print(f"삭제 중 오류 발생: {e}")
        return False
