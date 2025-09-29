from langgraph.graph import StateGraph, END
from ..core.logging import logger
from ..api.models.models import ContentState
from .nodes import generate_node, validate_node, error_node, router

async def generate_content_workflow(prompt: str) -> str:
    """
    Defines and executes the Langgraph workflow for generating and validating social media content.

    Args:
        prompt (str): The initial prompt for content generation.

    Returns:
        str: The validated generated content.

    Raises:
        Exception: If the content generation workflow fails.
    """
    workflow = StateGraph(ContentState)
    workflow.add_node("generate", generate_node)
    workflow.add_node("validate", validate_node)
    workflow.add_node("error", error_node)
    workflow.set_entry_point("generate")
    workflow.add_conditional_edges("generate", router, {"validate": "validate", "error": "error"})
    workflow.add_edge("validate", END)
    workflow.add_edge("error", END)

    app = workflow.compile()
    result = await app.ainvoke({"prompt": prompt, "content": None, "error": None})
    
    if result["error"]:
        logger.error(f"Workflow failed: {result['error']}")
        raise Exception(result["error"])
    return result["content"]
