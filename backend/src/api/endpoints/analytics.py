from fastapi import APIRouter
from ...api.services.storage_service import StorageService
from ...core.logging import logger

router = APIRouter()
storage = StorageService()

@router.get("/metrics")
async def get_metrics():
    """
    Retrieves mock engagement metrics for all posts.
    """
    metrics = storage.get_metrics()
    logger.info(f"Retrieved metrics for {len(metrics)} posts")
    return metrics