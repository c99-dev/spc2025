from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers.string import StrOutputParser


load_dotenv()

PERSIST_DIR = "./chroma_db"
COLLECTION_NAME = ["python_secure_coding_guide", "noval"]

embeddings = OpenAIEmbeddings()

stores = {
    name: Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings,
        collection_name=name,
    )
    for name in COLLECTION_NAME
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


def search_documents(question, k=3, target=None):
    if target:
        print(f"'{target}' 컬렉션에서 검색합니다.")
        return stores[target].similarity_search(question, k=k)
    else:
        print("모든 컬렉션에서 검색합니다.")
        docs = []
        for store in stores.values():
            docs.extend(store.similarity_search(question, k=2))
        return docs


def ask(question, target_collection=None):
    docs = search_documents(question, target=target_collection)
    context = "\n\n".join([doc.page_content for doc in docs])
    response = chain.invoke({"context": context, "question": question})
    return response


# Example usage
print(
    ask(
        "Python에서 보안 코딩을 위한 모범 사례는 무엇인가요?",
        target_collection="python_secure_coding_guide",
    )
)
