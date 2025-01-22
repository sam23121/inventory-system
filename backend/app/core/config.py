from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_USER: str = 'avnadmin'
    POSTGRES_PASSWORD: str = 'AVNS_6MI-1EylUyneDiDaS2o'
    POSTGRES_SERVER: str = 'pg-2924c7dc-smlalene-69f7.k.aivencloud.com'
    POSTGRES_DB: str = "defaultdb"
    POSTGRES_PORT: int = 20881
    #  DATABASE_URL: Optional[str] = 'postgresql://avnadmin:AVNS_6MI-1EylUyneDiDaS2o@pg-2924c7dc-smlalene-69f7.k.aivencloud.com:20881/defaultdb?sslmode=require'
    
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}?sslmode=require"
    
    class Config:
        env_file = ".env"

settings = Settings() 