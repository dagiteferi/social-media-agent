import uuid
import random
from typing import List, Dict
from ...core.logging import logger
from ..models.models import Post

class StorageService:
    """
    Manages in-memory storage for social media posts and generates mock metrics.

    This service is designed to meet the free-tier constraints by avoiding a persistent database.
    All data is lost upon application restart.
    """
    def __init__(self):
        self.posts: Dict[str, Dict] = {}
        logger.info("Initialized in-memory storage")

    def save_post(self, content: str) -> str:
        """
        Saves a new post to in-memory storage.

        Args:
            content (str): The content of the post.

        Returns:
            str: The unique ID of the saved post.
        """
        post_id = str(uuid.uuid4())
        self.posts[post_id] = {"content": content, "approved": False, "scheduled": False}
        logger.info(f"Saved new post with ID: {post_id}")
        return post_id

    def get_post(self, post_id: str) -> Dict:
        """
        Retrieves a post by its ID from in-memory storage.

        Args:
            post_id (str): The ID of the post to retrieve.

        Returns:
            Dict: The post dictionary if found, otherwise None.
        """
        post = self.posts.get(post_id)
        if post:
            logger.info(f"Retrieved post ID: {post_id}")
        else:
            logger.warning(f"Post ID not found: {post_id}")
        return post

    def get_all_posts(self) -> List[Dict]:
        """
        Retrieves all posts from in-memory storage.

        Returns:
            List[Dict]: A list of all post dictionaries.
        """
        posts = [{"id": k, **v} for k, v in self.posts.items()]
        logger.info(f"Retrieved {len(posts)} posts")
        return posts

    def update_post(self, post_id: str, approved: bool = None, scheduled: bool = None):
        """
        Updates the approval and/or scheduled status of a post.

        Args:
            post_id (str): The ID of the post to update.
            approved (bool, optional): New approval status. Defaults to None.
            scheduled (bool, optional): New scheduled status. Defaults to None.
        """
        if post_id in self.posts:
            if approved is not None:
                self.posts[post_id]["approved"] = approved
            if scheduled is not None:
                self.posts[post_id]["scheduled"] = scheduled
            logger.info(f"Updated post ID: {post_id} - approved: {approved}, scheduled: {scheduled}")
        else:
            logger.warning(f"Update failed, post ID not found: {post_id}")

    def get_approved_posts(self) -> List[Dict]:
        """
        Retrieves all approved and unscheduled posts.

        Returns:
            List[Dict]: A list of approved and unscheduled post dictionaries.
        """
        approved = [post for post_id, post in self.posts.items() if post["approved"] and not post["scheduled"]]
        logger.info(f"Retrieved {len(approved)} approved posts for scheduling")
        return approved

    def get_metrics(self) -> List[Dict]:
        """
        Generates and retrieves mock engagement metrics for all posts.

        Returns:
            List[Dict]: A list of dictionaries, each containing 'post_id', 'likes', and 'retweets'.
        """
        metrics = []
        for post_id in self.posts.keys():
            likes = random.randint(0, 100)
            retweets = random.randint(0, 50)
            metrics.append({"post_id": post_id, "likes": likes, "retweets": retweets})
        logger.info(f"Generated mock metrics for {len(metrics)} posts")
        return metrics
