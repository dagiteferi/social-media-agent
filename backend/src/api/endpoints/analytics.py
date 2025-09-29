from fastapi import APIRouter, Depends
from typing import List, Dict
from sqlmodel import Session
from ...api.services.postgresql_storage_service import PostgreSQLStorageService
from ...core.logging import logger
from ...main import get_storage_service

router = APIRouter()

@router.get("/metrics", response_model=List[Dict])
async def get_metrics(storage: PostgreSQLStorageService = Depends(get_storage_service)):
    """
    Retrieves mock engagement metrics for all posts.
    """
    metrics = await storage.get_metrics()
    logger.info(f"Retrieved metrics for {len(metrics)} posts")
    return metrics