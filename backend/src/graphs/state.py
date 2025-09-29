from typing import TypedDict, Optional

class ContentState(TypedDict):
    prompt: str
    content: Optional[str]
    error: Optional[str]
