import asyncio
from sqlmodel import SQLModel
from src.core.database import engine
from src.api.models.post import Post
from src.api.models.models import SocialMediaAgent

async def reset_database():
    """
    Drops and recreates all tables in the database.
    """
    print("Resetting database...")
    async with engine.begin() as conn:
        # Drop all tables
        await conn.run_sync(SQLModel.metadata.drop_all)
        print("Tables dropped.")
        # Create all tables
        await conn.run_sync(SQLModel.metadata.create_all)
        print("Tables created.")
    print("Database reset complete.")

if __name__ == "__main__":
    asyncio.run(reset_database())
