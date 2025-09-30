from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    TWITTER_API_KEY: str
    TWITTER_API_SECRET: str
    TWITTER_ACCESS_TOKEN: str
    TWITTER_ACCESS_TOKEN_SECRET: str
    DATABASE_URL: str
    CORS_ORIGINS: str = "*"
    DATABASE_ECHO: bool = False
    LOG_LEVEL: str = "DEBUG"
    GEMINI_API_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    TWITTER_API_BASE_URL: str = "https://api.twitter.com/2/tweets"
    MAX_RETRIES: int = 3
    INITIAL_BACKOFF: int = 1
    BRAND_NAME: str = "Your E-commerce Brand"
    AUDIENCE_DESCRIPTION: str = "online shoppers"
    UNIQUE_BENEFIT: str = "unbeatable quality"
    CTA: str = "Shop Now!"
    GEMINI_API_TIMEOUT: int = 10
    TWITTER_API_TIMEOUT: int = 10
    TWITTER_MAX_CHARS: int = 280

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()