from typing import Optional
from sqlmodel import Field, SQLModel

class SocialMediaAgent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None

class Post(SQLModel):
    id: str
    content: str
    approved: bool = False
    scheduled: bool = False