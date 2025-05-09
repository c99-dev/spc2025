from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=r"../../.env")

client = OpenAI()

model_list = client.models.list()
print(model_list)
