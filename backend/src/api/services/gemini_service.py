import requests
from ..core.config import settings
from ..core.logging import logger

def generate_content(prompt: str) -> str:
    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        params = {"key": settings.GEMINI_API_KEY}
        json_data = {
            "contents": [{"parts": [{"text": f"Generate an engaging Twitter post for an e-commerce brand: {prompt}"}]}],
            "generationConfig": {"maxOutputTokens": 280},
        }
        response = requests.post(url, params=params, json=json_data, timeout=5)
        response.raise_for_status()
        generated_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        logger.info(f"Generated content for prompt: {prompt}")
        return generated_text
    except requests.exceptions.RequestException as e:
        logger.error(f"Gemini API error: {str(e)}")
        return "Failed to generate content due to API error"
    except KeyError as e:
        logger.error(f"Unexpected response format from Gemini API: {str(e)}")
        return "Failed to parse API response"
```