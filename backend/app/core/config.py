from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://gm_user:gm_password@db:5432/gm_generator"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()