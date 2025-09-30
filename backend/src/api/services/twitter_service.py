import asyncio
import httpx
from ...core.logging import logger
from ..api_config import MAX_RETRIES, INITIAL_BACKOFF, TWITTER_API_URL, get_twitter_oauth1_client

async def schedule_post(content: str):
    """
    Schedules a Twitter post using the Twitter API v2.

    Includes a retry mechanism with exponential backoff for transient API errors.

    Args:
        content (str): The text content of the tweet to be scheduled.

    Returns:
        dict: The JSON response from the Twitter API if successful, or a mocked response/error message.
    """
    client = get_twitter_oauth1_client()
    for attempt in range(MAX_RETRIES):
        try:
            url = TWITTER_API_URL
            json_data = {"text": content}
            response = await client.post(url, json=json_data, timeout=10) # Increased timeout
            response.raise_for_status()
            logger.info(f"Scheduled post: {content[:50]}...")
            return response.json()
        except httpx.RequestError as e:
            error_detail = f"Request error: {e}"
            logger.warning(f"Twitter API request failed (attempt {attempt + 1}/{MAX_RETRIES}): {error_detail}")
            if attempt < MAX_RETRIES - 1:
                sleep_time = INITIAL_BACKOFF * (2 ** attempt)
                logger.info(f"Retrying in {sleep_time} seconds...")
                await asyncio.sleep(sleep_time)
            else:
                logger.error(f"Twitter API request failed after {MAX_RETRIES} attempts: {error_detail}")
                return {"status": "Failed to schedule post after multiple retries", "content": content}
        except httpx.HTTPStatusError as e:
            error_detail = f"Status: {e.response.status_code}, Response: {e.response.text}"
            logger.warning(f"Twitter API request failed (attempt {attempt + 1}/{MAX_RETRIES}): {error_detail}")
            if attempt < MAX_RETRIES - 1:
                sleep_time = INITIAL_BACKOFF * (2 ** attempt)
                logger.info(f"Retrying in {sleep_time} seconds...")
                await asyncio.sleep(sleep_time)
            else:
                logger.error(f"Twitter API request failed after {MAX_RETRIES} attempts: {error_detail}")
                return {"status": "Failed to schedule post after multiple retries", "content": content}
        except Exception as e:
            logger.error(f"Unexpected error in Twitter scheduling: {str(e)}")
            raise
    return {"status": "Failed to schedule post after multiple retries", "content": content}
