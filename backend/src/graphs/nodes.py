from fastapi import HTTPException
from ..api.services.gemini_service import generate_content
from ..core.logging import logger
from ..core.config import settings
from .state import ContentState

async def generate_node(state: ContentState) -> ContentState:
    """
    Langgraph node to generate content using the Gemini service.

    Args:
        state (ContentState): The current state of the content generation workflow.

    Returns:
        ContentState: The updated state with generated content or an error.
    """
    logger.info(f"Executing generate_node with prompt: {state['prompt']}")
    try:
        content = await generate_content(state["prompt"])
        return {"prompt": state["prompt"], "content": content, "error": None}
    except HTTPException as e:
        logger.error(f"Error in generate_node: {e.detail}")
        return {"prompt": state["prompt"], "content": None, "error": e.detail}
    except Exception as e:
        logger.error(f"Unexpected error in generate_node: {str(e)}")
        return {"prompt": state["prompt"], "content": None, "error": str(e)}

def validate_node(state: ContentState) -> ContentState:
    """
    Langgraph node to validate the generated content (e.g., character limit).

    Args:
        state (ContentState): The current state of the content generation workflow.

    Returns:
        ContentState: The updated state, potentially with an error if validation fails.
    """
    logger.info("Executing validate_node")
    if state["content"] and len(state["content"]) <= settings.TWITTER_MAX_CHARS:
        return state
    logger.warning(f"Invalid content: too long ({len(state["content"]) if state["content"] else 0} chars) or empty")
    return {"prompt": state["prompt"], "content": None, "error": f"Content exceeds {settings.TWITTER_MAX_CHARS} characters or is empty"}

def error_node(state: ContentState) -> ContentState:
    """
    Langgraph node to handle and log errors within the workflow.

    Args:
        state (ContentState): The current state of the content generation workflow.

    Returns:
        ContentState: The state with the error information.
    """
    logger.info("Executing error_node")
    return state

def router(state: ContentState) -> str:
    """
    Langgraph router to determine the next step based on the presence of an error.

    Args:
        state (ContentState): The current state of the content generation workflow.

    Returns:
        str: The name of the next node ('validate' or 'error').
    """
    if state["error"]:
        return "error"
    return "validate"
