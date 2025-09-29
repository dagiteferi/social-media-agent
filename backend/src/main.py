from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from .api.endpoints import analytics, content, scheduling
from .core.database import create_db_and_tables
from .api.dependencies import get_storage_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    await create_db_and_tables()
    yield

app = FastAPI(title="E-Commerce Social Media Agent Backend", version="1.0.0", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from modularized endpoint files
app.include_router(content.router, prefix="/api/v1/content", tags=["Content Management"])
app.include_router(scheduling.router, prefix="/api/v1/scheduling", tags=["Scheduling"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
