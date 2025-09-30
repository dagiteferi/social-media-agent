from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, func
from sqlalchemy.dialects.postgresql import TIMESTAMP

class SocialMediaAgent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    created_at: datetime = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now()))
    updated_at: datetime = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()))

    posts: List["Post"] = Relationship(back_populates="agent")