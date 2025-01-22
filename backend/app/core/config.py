from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables from the .env file in the main folder
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_USER: str = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD: str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_SERVER: str = os.getenv('POSTGRES_SERVER')
    POSTGRES_DB: str = os.getenv('POSTGRES_DB')
    POSTGRES_PORT: int = int(os.getenv('POSTGRES_PORT'))
    
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}?sslmode=require"
    
    class Config:
        env_file = ".env"

settings = Settings() 