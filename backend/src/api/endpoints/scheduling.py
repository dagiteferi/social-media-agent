from fastapi import APIRouter, HTTPException
from ...api.services.storage_service import StorageService
from ...api.services.twitter_service import schedule_post
from ...core.logging import logger


router = APIRouter()
storage = StorageService()

@router.post("/schedule/{post_id}")
async def schedule_specific_post(post_id: str):
    """
    Schedules a specific approved post to Twitter.
    """
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

@router.post("/schedule_trigger")
async def daily_schedule_trigger():
    """
    Triggered daily (e.g., by Cloud Scheduler) to schedule all approved and unscheduled posts.
    """
    approved_posts = storage.get_approved_posts()
    for post in approved_posts:
        try:
            schedule_post(post["content"])
            storage.update_post(post["id"], scheduled=True)
            logger.info(f"Scheduled post ID: {post['id']} via daily trigger")
        except Exception as e:
            logger.error(f"Error in daily scheduling for post {post['id']}: {str(e)}")
    return {"success": True, "posts_scheduled": len(approved_posts)}