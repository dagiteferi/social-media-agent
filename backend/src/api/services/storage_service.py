import uuid
import random
from typing import List, Dict
from pydantic import BaseModel
from ..core.logging import logger

class Post(BaseModel):
    id: str
    content: str
    approved: bool = False
    scheduled: bool = False

class StorageService:
    def __init__(self):
        self.posts: Dict[str, Dict] = {}
        logger.info("Initialized in-memory storage")

    def save_post(self, content: str) -> str:
        post_id = str(uuid.uuid4())
        self.posts[post_id] = {"content": content, "approved": False, "scheduled": False}
        logger.info(f"Saved new post with ID: {post_id}")
        return post_id

    def get_post(self, post_id: str) -> Dict:
        post = self.posts.get(post_id)
        if post:
            logger.info(f"Retrieved post ID: {post_id}")
        else:
            logger.warning(f"Post ID not found: {post_id}")
        return post

    def get_all_posts(self) -> List[Dict]:
        posts = [{"id": k, **v} for k, v in self.posts.items()]
        logger.info(f"Retrieved {len(posts)} posts")
        return posts

    def update_post(self, post_id: str, approved: bool = None, scheduled: bool = None):
        if post_id in self.posts:
            if approved is not None:
                self.posts[post_id]["approved"] = approved
            if scheduled is not None:
                self.posts[post_id]["scheduled"] = scheduled
            logger.info(f"Updated post ID: {post_id} - approved: {approved}, scheduled: {scheduled}")
        else:
            logger.warning(f"Update failed, post ID not found: {post_id}")

    def get_approved_posts(self) -> List[Dict]:
        approved = [post for post_id, post in self.posts.items() if post["approved"] and not post["scheduled"]]
        logger.info(f"Retrieved {len(approved)} approved posts for scheduling")
        return approved

    def get_metrics(self) -> List[Dict]:
        metrics = []
        for post_id in self.posts.keys():
            likes = random.randint(0, 100)
            retweets = random.randint(0, 50)
            metrics.append({"post_id": post_id, "likes": likes, "retweets": retweets})
        logger.info(f"Generated mock metrics for {len(metrics)} posts")
        return metrics
