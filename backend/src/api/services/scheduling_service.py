import asyncio
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from ...core.database import engine
from ...core.logging import logger
from ..models.post import Post
from . import twitter_service

# Create a sessionmaker for the scheduler
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def check_and_post_scheduled_posts():
    """
    Checks for scheduled posts that are due and posts them to Twitter.
    """
    logger.info("Checking for scheduled posts...")
    async with async_session() as session:
        try:
            now = datetime.now(timezone.utc)
            posts_to_schedule = (await session.exec(
                Post.select().where(Post.approved == True, Post.is_posted == False, Post.scheduled_at <= now)
            )).all()

            if not posts_to_schedule:
                logger.info("No scheduled posts to post.")
                return

            for post in posts_to_schedule:
                try:
                    logger.info(f"Posting scheduled post with ID: {post.id}")
                    await twitter_service.schedule_post(post.content)
                    post.is_posted = True
                    session.add(post)
                    logger.info(f"Successfully posted scheduled post with ID: {post.id}")
                except Exception as e:
                    logger.error(f"Failed to post scheduled post with ID {post.id}: {e}")

            await session.commit()
        except Exception as e:
            logger.error(f"An error occurred in check_and_post_scheduled_posts: {e}")
            await session.rollback()

scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Starts the scheduler and adds the job to check for scheduled posts.
    """
    logger.info("Starting scheduler...")
    scheduler.add_job(check_and_post_scheduled_posts, 'interval', minutes=1)
    scheduler.start()
    logger.info("Scheduler started.")

def stop_scheduler():
    """
    Stops the scheduler.
    """
    logger.info("Stopping scheduler...")
    scheduler.shutdown()
    logger.info("Scheduler stopped.")