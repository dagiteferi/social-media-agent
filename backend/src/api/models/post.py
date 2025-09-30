from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class Post(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    content: str
    approved: bool = Field(default=False)
    scheduled: bool = Field(default=False)