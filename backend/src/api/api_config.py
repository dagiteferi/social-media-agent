from ..core.config import settings

# Retry Configuration
MAX_RETRIES = 3
INITIAL_BACKOFF = 1  # seconds

# Gemini API Configuration
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

# Twitter API Configuration
TWITTER_API_URL = "https://api.twitter.com/2/tweets"

def get_twitter_headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.TWITTER_BEARER_TOKEN}",
        "Content-Type": "application/json"
    }
