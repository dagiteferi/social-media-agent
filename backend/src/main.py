from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.endpoints import analytics, content, scheduling

app = FastAPI(title="E-Commerce Social Media Agent Backend", version="1.0.0")

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
