"""
Redis configuration with aioredis support
"""
import aioredis
from typing import AsyncGenerator

from app.core.config import settings


# Create Redis connection
redis_client = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True
)


async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    """
    Dependency to get Redis client
    """
    try:
        yield redis_client
    finally:
        await redis_client.close()


async def init_redis():
    """
    Initialize Redis connection
    """
    await redis_client.ping()


async def close_redis():
    """
    Close Redis connection
    """
    await redis_client.close() 