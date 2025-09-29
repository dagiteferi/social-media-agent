from pydantic import BaseModel

class Post(BaseModel):
    id: str
    content: str
    approved: bool = False
    scheduled: bool = False