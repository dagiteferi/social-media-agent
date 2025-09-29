from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    TWITTER_BEARER_TOKEN: str
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()