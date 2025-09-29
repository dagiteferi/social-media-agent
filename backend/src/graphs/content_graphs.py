from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from ..services.gemini_service import generate_content
from ..core.logging import logger

class ContentState(TypedDict):
    prompt: str
    content: Optional[str]
    error: Optional[str]

def generate_node(state: ContentState) -> ContentState:
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
    logger.info("Executing validate_node")
    if state["content"] and len(state["content"]) <= 280:
        return state
    logger.warning("Invalid content: too long or empty")
    return {"prompt": state["prompt"], "content": None, "error": "Content exceeds 280 characters or is empty"}

def error_node(state: ContentState) -> ContentState:
    logger.info("Executing error_node")
    return state

def router(state: ContentState) -> str:
    if state["error"]:
        return "error"
    return "validate"

async def generate_content_workflow(prompt: str) -> str:
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
