from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, func
from sqlalchemy.dialects.postgresql import TIMESTAMP

class Post(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    content: str
    approved: bool = Field(default=False)
    scheduled_at: Optional[datetime] = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True)))
    is_posted: bool = Field(default=False)
    created_at: datetime = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now()))
    updated_at: datetime = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()))

    # Foreign key to SocialMediaAgent
    agent_id: Optional[int] = Field(default=None, foreign_key="socialmediaagent.id")
    agent: Optional["SocialMediaAgent"] = Relationship(back_populates="posts")
