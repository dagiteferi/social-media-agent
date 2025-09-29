import requests
import time
from ...core.config import settings
from ...core.logging import logger
from ...graphs.prompt_template import GENERATE_TWEET_PROMPT
from ..api_config import MAX_RETRIES, INITIAL_BACKOFF, GEMINI_API_URL

def generate_content(prompt: str) -> str:
    """
    Generates engaging social media content using the Gemini API.

    Args:
        prompt (str): The user's prompt or topic for content generation.

    Returns:
        str: The generated content suitable for a Twitter post, or an error message if generation fails.
    """
    for attempt in range(MAX_RETRIES):
        try:
            url = GEMINI_API_URL
            params = {"key": settings.GOOGLE_API_KEY}
            json_data = {
                "contents": [{"parts": [{"text": GENERATE_TWEET_PROMPT.format(
                    brand_name="Your E-commerce Brand",
                    product_or_offer=prompt,
                    audience_description="online shoppers",
                    unique_benefit="unbeatable quality",
                    cta="Shop Now!"
                )}]}],
            }
            response = requests.post(url, params=params, json=json_data, timeout=10) # Increased timeout
            response.raise_for_status()
            generated_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            logger.info(f"Generated content for prompt: {prompt}")
            return generated_text
        except requests.exceptions.RequestException as e:
            error_detail = f"Status: {e.response.status_code}, Response: {e.response.text}" if e.response else str(e)
            logger.warning(f"Gemini API request failed (attempt {attempt + 1}/{MAX_RETRIES}): {error_detail}")
            if attempt < MAX_RETRIES - 1:
                sleep_time = INITIAL_BACKOFF * (2 ** attempt)
                logger.info(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                logger.error(f"Gemini API request failed after {MAX_RETRIES} attempts: {error_detail}")
                return "Failed to generate content due to API error"
        except KeyError as e:
            logger.error(f"Unexpected response format from Gemini API: {str(e)}")
            return "Failed to parse API response"
    return "Failed to generate content after multiple retries"
