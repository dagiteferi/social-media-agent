from fastapi import HTTPException, status

class PostNotFoundException(HTTPException):
    def __init__(self, post_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with ID {post_id} not found"
        )

class AgentNotFoundException(HTTPException):
    def __init__(self, agent_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Social Media Agent with ID {agent_id} not found"
        )

class DatabaseOperationException(HTTPException):
    def __init__(self, detail: str = "A database operation failed"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )
