import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "cineaddict_super_secret_key_123" 

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")