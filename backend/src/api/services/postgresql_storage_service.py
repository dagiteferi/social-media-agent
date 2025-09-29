import random
from typing import List, Dict
from sqlmodel import Session, select
from ...core.logging import logger
from ...api.models.post import Post

class PostgreSQLStorageService:
    """
    Manages PostgreSQL storage for social media posts.

    This service interacts with the database to perform CRUD operations on posts.
    """
    def __init__(self, session: Session):
        self.session = session
        logger.info("Initialized PostgreSQLStorageService")

    async def save_post(self, content: str) -> str:
        """
        Saves a new post to the PostgreSQL database.

        Args:
            content (str): The content of the post.

        Returns:
            str: The unique ID of the saved post.
        """
        post = Post(content=content)
        self.session.add(post)
        await self.session.commit()
        await self.session.refresh(post)
        logger.info(f"Saved new post with ID: {post.id}")
        return post.id

    async def get_post(self, post_id: str) -> Post | None:
        """
        Retrieves a post by its ID from the PostgreSQL database.

        Args:
            post_id (str): The ID of the post to retrieve.

        Returns:
            Post: The Post object if found, otherwise None.
        """
        post = await self.session.get(Post, post_id)
        if post:
            logger.info(f"Retrieved post ID: {post_id}")
        else:
            logger.warning(f"Post ID not found: {post_id}")
        return post

    async def get_all_posts(self) -> List[Post]:
        """
        Retrieves all posts from the PostgreSQL database.

        Returns:
            List[Post]: A list of all Post objects.
        """
        posts = await self.session.exec(select(Post)).all()
        logger.info(f"Retrieved {len(posts)} posts from DB")
        return posts

    async def update_post(self, post_id: str, approved: bool = None, scheduled: bool = None):
        """
        Updates the approval and/or scheduled status of a post in the PostgreSQL database.

        Args:
            post_id (str): The ID of the post to update.
            approved (bool, optional): New approval status. Defaults to None.
            scheduled (bool, optional): New scheduled status. Defaults to None.
        """
        post = await self.session.get(Post, post_id)
        if post:
            if approved is not None:
                post.approved = approved
            if scheduled is not None:
                post.scheduled = scheduled
            self.session.add(post)
            await self.session.commit()
            await self.session.refresh(post)
            logger.info(f"Updated post ID: {post_id} - approved: {approved}, scheduled: {scheduled}")
        else:
            logger.warning(f"Update failed, post ID not found: {post_id}")

    async def get_approved_posts(self) -> List[Post]:
        """
        Retrieves all approved and unscheduled posts from the PostgreSQL database.

        Returns:
            List[Post]: A list of approved and unscheduled Post objects.
        """
        posts = await self.session.exec(select(Post).where(Post.approved == True, Post.scheduled == False)).all()
        logger.info(f"Retrieved {len(posts)} approved posts for scheduling from DB")
        return posts

    # Mock metrics remain as per SRS, not stored in DB
    async def get_metrics(self) -> List[Dict]:
        """
        Generates and retrieves mock engagement metrics for all posts.

        Returns:
            List[Dict]: A list of dictionaries, each containing 'post_id', 'likes', and 'retweets'.
        """
        # This method remains unchanged as per SRS, mock data not stored in DB
        posts = await self.session.exec(select(Post)).all() # Need to get all post IDs for mock metrics
        metrics = []
        for post in posts:
            likes = random.randint(0, 100)
            retweets = random.randint(0, 50)
            metrics.append({"post_id": post.id, "likes": likes, "retweets": retweets})
        logger.info(f"Generated mock metrics for {len(metrics)} posts")
        return metrics