from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnableLambda

load_dotenv()

template = "you are a naming consultant for new companes. what is a good name for {company} that makes {product} 5 names?"

prompt = PromptTemplate(
    input_variables=["company", "product"],
    template=template,
)

llm = OpenAI(temperature=0.9)

chain = prompt | llm | RunnableLambda(lambda x: {"response": x.strip()})

inputs = {
    "company": "apple",
    "product": "fruit",
}
response = chain.invoke(inputs)
print(response)
