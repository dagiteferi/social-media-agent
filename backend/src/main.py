from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from .api.endpoints import analytics, content
from .core.database import create_db_and_tables
from .api.dependencies import get_storage_service
from .core.config import settings
from .api.services.scheduling_service import start_scheduler, stop_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    await create_db_and_tables()
    # Start the scheduler
    start_scheduler()
    yield
    # Stop the scheduler
    stop_scheduler()

app = FastAPI(title="E-Commerce Social Media Agent Backend", version="1.0.0", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from modularized endpoint files
app.include_router(content.router, prefix="/api/v1/content", tags=["Content Management"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
