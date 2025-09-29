import requests
import time
from ...core.config import settings
from ...core.logging import logger
from ..api_config import MAX_RETRIES, INITIAL_BACKOFF, TWITTER_API_URL, get_twitter_headers

def schedule_post(content: str):
    """
    Schedules a Twitter post using the Twitter API v2.

    Includes a retry mechanism with exponential backoff for transient API errors.

    Args:
        content (str): The text content of the tweet to be scheduled.

    Returns:
        dict: The JSON response from the Twitter API if successful, or a mocked response/error message.
    """
    for attempt in range(MAX_RETRIES):
        try:
            url = TWITTER_API_URL
            headers = get_twitter_headers()
            json_data = {"text": content}
            response = requests.post(url, headers=headers, json=json_data, timeout=10) # Increased timeout
            response.raise_for_status()
            logger.info(f"Scheduled post: {content[:50]}...")
            return response.json()
        except requests.exceptions.RequestException as e:
            error_detail = f"Status: {e.response.status_code}, Response: {e.response.text}" if e.response else str(e)
            logger.warning(f"Twitter API request failed (attempt {attempt + 1}/{MAX_RETRIES}): {error_detail}")
            if attempt < MAX_RETRIES - 1:
                sleep_time = INITIAL_BACKOFF * (2 ** attempt)
                logger.info(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                logger.error(f"Twitter API request failed after {MAX_RETRIES} attempts: {error_detail}")
                # Mock response for testing or rate limit handling
                return {"status": "Mocked scheduling due to API limitations", "content": content}
        except Exception as e:
            logger.error(f"Unexpected error in Twitter scheduling: {str(e)}")
            raise
    return {"status": "Failed to schedule post after multiple retries", "content": content}
