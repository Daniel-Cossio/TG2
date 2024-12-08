from pathlib import Path

from pydantic_settings import BaseSettings

top_dir = Path(__file__).resolve().parents[0]
db_dir = top_dir / "db"
db_name = "tesis.db"
db_path = str(db_dir / db_name)


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tesis backend"
    DESCRIPTION: str = "A FastAPI + SQLModel production-ready API"
    VERSION: str = "0.1"
    DATABASE_URI: str = f"sqlite:///{db_path}"
    #DATABASE_URI: str = "postgresql://postgres:Univalle00@34.29.156.123:5432/postgres"

    class Config:
        case_sensitive = True


settings = Settings()


class TestSettings(Settings):
    class Config:
        case_sensitive = True


test_settings = TestSettings()
