from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

load_dotenv()

PERSIST_DIR = "./chroma_db"
COLLECTION_NAME = "python_secure_coding_guide"

embeddings = OpenAIEmbeddings()

store = Chroma(
    persist_directory=PERSIST_DIR,
    embedding_function=embeddings,
    collection_name=COLLECTION_NAME,
)

count = store._collection.count()
print("컬렉션의 문서 수:", count)

# results = store._collection.get(include=["documents", "metadatas"], limit=10)
# ids = results["ids"]
# docs = results["documents"]
# metadatas = results["metadatas"]

# for i, doc in enumerate(docs):
#     print(f"문서 {i}: {doc[:100]}...")
#     print(f"문서 ID {i}: {ids[i]}")
#     print(f"메타데이터 {i}: {metadatas[i]}")
#     print("-" * 50)

docs = store.similarity_search("SQL", k=5)
for i, doc in enumerate(docs):
    print(f"문서 {i}: {doc.page_content[:100]}...")
    print(f"문서 ID {i}: {doc.id}")
    print(f"메타데이터 {i}: {doc.metadata}")
    print("-" * 50)
