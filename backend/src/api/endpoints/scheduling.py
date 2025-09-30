from fastapi import APIRouter, HTTPException, Depends, status
from ...api.services.postgresql_storage_service import PostgreSQLStorageService
from ...api.services.twitter_service import schedule_post as post_to_twitter
from ...core.logging import logger
from ..dependencies import get_storage_service
from ..exceptions import PostNotFoundException, DatabaseOperationException, TwitterAPIException

router = APIRouter()

@router.post("/post_now/{post_id}")
async def post_now(post_id: str, storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Immediately posts an approved post to Twitter.
    """
    try:
        post = await storage.get_post(post_id)
        if not post.approved:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Post is not approved")

        if post.is_posted:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Post has already been posted")

        if not post.content or not post.content.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Post content is empty")

        logger.info(f"Attempting to post immediately: {post.id}")
        await post_to_twitter(post.content)
        await storage.update_post(post_id, is_posted=True)
        logger.info(f"Successfully posted post ID: {post_id}")
        return {"success": True, "message": "Post sent to Twitter successfully."}
    except PostNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except TwitterAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except DatabaseOperationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        logger.error(f"Error posting post now: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
