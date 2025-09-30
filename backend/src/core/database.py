from typing import AsyncGenerator

from sqlmodel import SQLModel, create_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine

from .config import settings
from .logging import logger

# Use create_async_engine for async database operations
engine = create_async_engine(settings.DATABASE_URL, echo=settings.DATABASE_ECHO, future=True)

async def create_db_and_tables():
    """
    Creates database tables based on SQLModel metadata.
    This function is for development/testing. In production, use migrations.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.info("Database tables created (if not already existing).")

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides an asynchronous session for database interactions.
    """
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
        await session.commit()
        logger.debug("Database session committed.")
