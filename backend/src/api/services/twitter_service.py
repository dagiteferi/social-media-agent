import requests
from ..core.config import settings
from ..core.logging import logger

def schedule_post(content: str):
    try:
        url = "https://api.twitter.com/2/tweets"
        headers = {
            "Authorization": f"Bearer {settings.TWITTER_BEARER_TOKEN}",
            "Content-Type": "application/json"
        }
        json_data = {"text": content}
        response = requests.post(url, headers=headers, json=json_data, timeout=5)
        response.raise_for_status()
        logger.info(f"Scheduled post: {content[:50]}...")
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Twitter API error: {str(e)}")
        # Mock response for testing or rate limit handling
        return {"status": "Mocked scheduling due to API limitations", "content": content}
    except Exception as e:
        logger.error(f"Unexpected error in Twitter scheduling: {str(e)}")
        raise
