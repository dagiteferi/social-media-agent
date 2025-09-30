import random
from typing import List, Dict, Optional
from datetime import datetime
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError
from ...core.logging import logger
from ...api.models.post import Post
from ...api.models.models import SocialMediaAgent
from ..exceptions import PostNotFoundException, DatabaseOperationException, AgentNotFoundException

class PostgreSQLStorageService:
    """
    Manages PostgreSQL storage for social media posts.

    This service interacts with the database to perform CRUD operations on posts.
    """
    def __init__(self, session: Session):
        self.session = session
        logger.info("Initialized PostgreSQLStorageService")

    async def save_post(self, content: str, agent_id: Optional[int] = None) -> str:
        """
        Saves a new post to the PostgreSQL database.

        Args:
            content (str): The content of the post.
            agent_id (Optional[int]): The ID of the social media agent creating the post.

        Returns:
            str: The unique ID of the saved post.
        """
        try:
            if agent_id:
                agent = await self.session.get(SocialMediaAgent, agent_id)
                if not agent:
                    raise AgentNotFoundException(agent_id=agent_id)
            post = Post(content=content, agent_id=agent_id)
            self.session.add(post)
            await self.session.commit()
            await self.session.refresh(post)
            logger.info(f"Saved new post with ID: {post.id}")
            return str(post.id)
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise DatabaseOperationException(detail=f"Failed to save post: {e}")

    async def get_post(self, post_id: str) -> Post:
        """
        Retrieves a post by its ID from the PostgreSQL database.

        Args:
            post_id (str): The ID of the post to retrieve.

        Returns:
            Post: The Post object if found.

        Raises:
            PostNotFoundException: If the post is not found.
        """
        try:
            post = await self.session.get(Post, post_id)
            if not post:
                raise PostNotFoundException(post_id=post_id)
            logger.info(f"Retrieved post ID: {post_id}")
            return post
        except SQLAlchemyError as e:
            raise DatabaseOperationException(detail=f"Failed to retrieve post: {e}")

    async def get_all_posts(self) -> List[Post]:
        """
        Retrieves all posts from the PostgreSQL database.

        Returns:
            List[Post]: A list of all Post objects.
        """
        try:
            result = await self.session.execute(select(Post))
            posts = result.scalars().all()
            logger.info(f"Retrieved {len(posts)} posts from DB")
            return posts
        except SQLAlchemyError as e:
            raise DatabaseOperationException(detail=f"Failed to retrieve all posts: {e}")

    async def update_post(self, post_id: str, approved: Optional[bool] = None, scheduled_at: Optional[datetime] = None, is_posted: Optional[bool] = None, agent_id: Optional[int] = None):
        """
        Updates the approval status, scheduled time, posted status, and/or agent of a post.

        Args:
            post_id (str): The ID of the post to update.
            approved (bool, optional): New approval status.
            scheduled_at (datetime, optional): New scheduled time.
            is_posted (bool, optional): New posted status.
            agent_id (Optional[int]): New agent ID.
        """
        try:
            post = await self.session.get(Post, post_id)
            if not post:
                raise PostNotFoundException(post_id=post_id)

            if approved is not None:
                post.approved = approved
            if scheduled_at is not None:
                post.scheduled_at = scheduled_at
            if is_posted is not None:
                post.is_posted = is_posted
            if agent_id is not None:
                agent = await self.session.get(SocialMediaAgent, agent_id)
                if not agent:
                    raise AgentNotFoundException(agent_id=agent_id)
                post.agent_id = agent_id

            self.session.add(post)
            await self.session.commit()
            await self.session.refresh(post)
            logger.info(f"Updated post ID: {post_id} - approved: {approved}, scheduled_at: {scheduled_at}, is_posted: {is_posted}, agent_id: {agent_id}")
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise DatabaseOperationException(detail=f"Failed to update post: {e}")

    # Mock metrics remain as per SRS, not stored in DB
    async def get_metrics(self) -> List[Dict]:
        """
        Generates and retrieves mock engagement metrics for all posts.

        Returns:
            List[Dict]: A list of dictionaries, each containing 'post_id', 'likes', and 'retweets'.
        """
        # This method remains unchanged as per SRS, mock data not stored in DB
        try:
            result = await self.session.execute(select(Post))
            posts = result.scalars().all()
            metrics = []
            for post in posts:
                likes = random.randint(0, 100)
                retweets = random.randint(0, 50)
                metrics.append({"post_id": str(post.id), "likes": likes, "retweets": retweets})
            logger.info(f"Generated mock metrics for {len(metrics)} posts")
            return metrics
        except SQLAlchemyError as e:
            raise DatabaseOperationException(detail=f"Failed to generate mock metrics: {e}")