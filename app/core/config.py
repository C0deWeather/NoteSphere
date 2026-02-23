from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Basic app settings
    env: str = "development"
    debug: bool = True

    # Security
    secret_key: str
    access_token_exp_minutes: int = 30
    algorithm: str = "HS256"

    # Database
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",              # load from .env (local dev)
        env_file_encoding="utf-8",
        extra="ignore",               # ignore unknown env vars
    )

    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    # cache so settings is created once
    return Settings()


settings = get_settings()
