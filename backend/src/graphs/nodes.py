from ..api.services.gemini_service import generate_content
from ..core.logging import logger
from .state import ContentState

def generate_node(state: ContentState) -> ContentState:
    """
    Langgraph node to generate content using the Gemini service.

    Args:
        state (ContentState): The current state of the content generation workflow.

    Returns:
        ContentState: The updated state with generated content or an error.
    """
    logger.info(f"Executing generate_node with prompt: {state['prompt']}")
    try:
        content = generate_content(state["prompt"])
        if "Failed" in content:
            return {"prompt": state["prompt"], "content": None, "error": content}
        return {"prompt": state["prompt"], "content": content, "error": None}
    except Exception as e:
        logger.error(f"Error in generate_node: {str(e)}")
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
    if state["content"] and len(state["content"]) <= 280:
        return state
    logger.warning("Invalid content: too long or empty")
    return {"prompt": state["prompt"], "content": None, "error": "Content exceeds 280 characters or is empty"}

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
