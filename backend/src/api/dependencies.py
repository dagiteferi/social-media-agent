from typing import AsyncGenerator

from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from .services.postgresql_storage_service import PostgreSQLStorageService
from ..core.database import get_session

async def get_storage_service(session: AsyncSession = Depends(get_session)) -> PostgreSQLStorageService:
    """
    Dependency that provides a PostgreSQLStorageService instance with a database session.
    """
    return PostgreSQLStorageService(session=session)
