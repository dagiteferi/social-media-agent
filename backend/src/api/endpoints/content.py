from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from ...api.services.storage_service import StorageService
from ...graphs import generate_content_workflow
from ...core.logging import logger
from ...api.models.models import Post

router = APIRouter()
storage = StorageService()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/generate", response_model=Post)
async def generate_post(request: PromptRequest):
    """
    Generates a new social media post based on a user prompt.
    The post is saved in an unapproved and unscheduled state.
    """
    logger.info(f"Generating post for prompt: {request.prompt}")
    try:
        content = await generate_content_workflow(request.prompt)
        post_id = storage.save_post(content)
        logger.info(f"Generated post ID: {post_id}")
        return {"id": post_id, "content": content, "approved": False, "scheduled": False}
    except Exception as e:
        logger.error(f"Error generating post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve/{post_id}")
async def approve_post(post_id: str):
    """
    Approves a generated post, making it eligible for scheduling.
    """
    post = storage.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    storage.update_post(post_id, approved=True)
    logger.info(f"Approved post ID: {post_id}")
    return {"success": True}

@router.get("/posts", response_model=List[Post])
async def get_posts():
    """
    Retrieves all stored social media posts.
    """
    posts = storage.get_all_posts()
    logger.info(f"Retrieved {len(posts)} posts")
    return posts