import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """기본 설정"""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_key")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
    CORS_ORIGINS = ["http://localhost:5173"]
