from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict
from ...api.services.postgresql_storage_service import PostgreSQLStorageService
from ...api.services.twitter_service import schedule_post
from ...core.logging import logger
from ..dependencies import get_storage_service
from ..exceptions import PostNotFoundException, DatabaseOperationException, TwitterAPIException

router = APIRouter()

@router.post("/schedule/{post_id}")
async def schedule_specific_post(post_id: str, storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Schedules a specific approved post to Twitter.
    """
    try:
        post = await storage.get_post(post_id)
        if not post.approved:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Post is not approved")

        await schedule_post(post.content)
        await storage.update_post(post_id, scheduled=True)
        logger.info(f"Scheduled post ID: {post_id}")
        return {"success": True}
    except PostNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except TwitterAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        logger.error(f"Error scheduling post: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/schedule_trigger")
async def daily_schedule_trigger(storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Triggered daily (e.g., by Cloud Scheduler) to schedule all approved and unscheduled posts.
    """
    failed_posts = []
    try:
        approved_posts = await storage.get_approved_posts()
        for post in approved_posts:
            try:
                await schedule_post(post.content)
                await storage.update_post(post.id, scheduled=True)
                logger.info(f"Scheduled post ID: {post.id} via daily trigger")
            except TwitterAPIException as e:
                logger.error(f"Twitter API error for post {post.id}: {e.detail}")
                failed_posts.append({"post_id": str(post.id), "error": e.detail})
            except DatabaseOperationException as e:
                logger.error(f"Database error for post {post.id}: {e.detail}")
                failed_posts.append({"post_id": str(post.id), "error": e.detail})
            except Exception as e:
                logger.error(f"Unexpected error for post {post.id}: {str(e)}")
                failed_posts.append({"post_id": str(post.id), "error": str(e)})
        
        return {"success": True, "posts_processed": len(approved_posts), "posts_failed": failed_posts}
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        logger.error(f"Error in daily scheduling trigger: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))