from pydantic import BaseModel
from typing import TypedDict, Optional

class Post(BaseModel):
    id: str
    content: str
    approved: bool = False
    scheduled: bool = False

class ContentState(TypedDict):
    prompt: str
    content: Optional[str]
    error: Optional[str]