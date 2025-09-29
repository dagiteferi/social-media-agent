from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .core.config import settings
from .api.services.storage_service import StorageService
from .graphs import generate_content_workflow
from .api.services.twitter_service import schedule_post
from .core.logging import logger
from fastapi.middleware.cors import CORSMiddleware
from .api.models.models import Post

app = FastAPI(title="E-Commerce Social Media Agent Backend", version="1.0.0")
storage = StorageService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate", response_model=Post)
async def generate_post(request: PromptRequest):
    logger.info(f"Generating post for prompt: {request.prompt}")
    try:
        content = await generate_content_workflow(request.prompt)
        post_id = storage.save_post(content)
        logger.info(f"Generated post ID: {post_id}")
        return {"id": post_id, "content": content, "approved": False, "scheduled": False}
    except Exception as e:
        logger.error(f"Error generating post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/approve/{post_id}")
async def approve_post(post_id: str):
    post = storage.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    storage.update_post(post_id, approved=True)
    logger.info(f"Approved post ID: {post_id}")
    return {"success": True}

@app.post("/schedule/{post_id}")
async def schedule_specific_post(post_id: str):
    post = storage.get_post(post_id)
    if not post or not post["approved"]:
        raise HTTPException(status_code=400, detail="Post not approved or not found")
    try:
        schedule_post(post["content"])
        storage.update_post(post_id, scheduled=True)
        logger.info(f"Scheduled post ID: {post_id}")
        return {"success": True}
    except Exception as e:
        logger.error(f"Error scheduling post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/posts", response_model=List[Post])
async def get_posts():
    posts = storage.get_all_posts()
    logger.info(f"Retrieved {len(posts)} posts")
    return posts

@app.get("/metrics")
async def get_metrics():
    metrics = storage.get_metrics()
    logger.info(f"Retrieved metrics for {len(metrics)} posts")
    return metrics

@app.post("/schedule_trigger")
async def daily_schedule_trigger():
    approved_posts = storage.get_approved_posts()
    for post in approved_posts:
        try:
            schedule_post(post["content"])
            storage.update_post(post["id"], scheduled=True)
            logger.info(f"Scheduled post ID: {post['id']} via daily trigger")
        except Exception as e:
            logger.error(f"Error in daily scheduling for post {post['id']}: {str(e)}")
    return {"success": True, "posts_scheduled": len(approved_posts)}
```