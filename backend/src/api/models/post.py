from typing import Optional
from sqlmodel import Field, SQLModel

class Post(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    content: str
    approved: bool = Field(default=False)
    scheduled: bool = Field(default=False)