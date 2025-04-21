from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    OWM_API_KEY: str | None = None  # Optional: OpenWeatherMap API

    class Config:
        env_file = ".env"

settings = Settings()
