from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel
from ...api.services.postgresql_storage_service import PostgreSQLStorageService
from ...graphs import generate_content_workflow
from ...core.logging import logger
from ...api.models.post import Post
from ..dependencies import get_storage_service
from ..exceptions import PostNotFoundException, DatabaseOperationException

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str
    agent_id: Optional[int] = None # Added optional agent_id

@router.post("/generate", response_model=Post)
async def generate_post(request: PromptRequest, storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Generates a new social media post based on a user prompt.
    The post is saved in an unapproved and unscheduled state.
    """
    logger.info(f"Generating post for prompt: {request.prompt}")
    try:
        content = await generate_content_workflow(request.prompt)
        # Pass agent_id to save_post
        post_id = await storage.save_post(content, agent_id=request.agent_id)
        logger.info(f"Generated post ID: {post_id}")
        # Ensure Post model is correctly instantiated with agent_id
        return Post(id=post_id, content=content, approved=False, scheduled=False, agent_id=request.agent_id)
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        logger.error(f"Error generating post: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/approve/{post_id}")
async def approve_post(post_id: str, storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Approves a generated post, making it eligible for scheduling.
    """
    try:
        await storage.update_post(post_id, approved=True)
        logger.info(f"Approved post ID: {post_id}")
        return {"success": True}
    except PostNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/posts", response_model=List[Post])
async def get_posts(storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Retrieves all stored social media posts.
    """
    try:
        posts = await storage.get_all_posts()
        logger.info(f"Retrieved {len(posts)} posts")
        return posts
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)