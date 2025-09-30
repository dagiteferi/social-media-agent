from authlib.integrations.httpx_client import AsyncOAuth1Client
from ..core.config import settings

# Retry Configuration
MAX_RETRIES = settings.MAX_RETRIES
INITIAL_BACKOFF = settings.INITIAL_BACKOFF

# Gemini API Configuration
GEMINI_API_URL = settings.GEMINI_API_BASE_URL

# Twitter API Configuration
TWITTER_API_URL = settings.TWITTER_API_BASE_URL

def get_twitter_oauth1_client() -> AsyncOAuth1Client:
    return AsyncOAuth1Client(
        client_id=settings.TWITTER_API_KEY,
        client_secret=settings.TWITTER_API_SECRET,
        token=settings.TWITTER_ACCESS_TOKEN,
        token_secret=settings.TWITTER_ACCESS_TOKEN_SECRET,
    )
