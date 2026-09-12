from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
import os

# Use SQLite fallback by default for local development without Docker
# For production, supply a postgresql+asyncpg URL via DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./flowmix.db")

# SQLite async driver (aiosqlite) requires specific poolclass/connect_args, but we use defaults for simplicity in MVP
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
