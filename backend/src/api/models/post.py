from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship

class Post(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    content: str
    approved: bool = Field(default=False)
    scheduled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Foreign key to SocialMediaAgent
    agent_id: Optional[int] = Field(default=None, foreign_key="socialmediaagent.id")
    agent: Optional["SocialMediaAgent"] = Relationship(back_populates="posts")