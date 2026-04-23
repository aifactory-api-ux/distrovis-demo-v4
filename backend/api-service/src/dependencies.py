from sqlalchemy.orm import Session
from src.db import get_db_session
from src.cache import get_cache, set_cache
from typing import Generator


def get_db() -> Generator[Session, None, None]:
    db = get_db_session()
    try:
        yield db
    finally:
        db.close()


async def get_cached_kpis():
    return await get_cache("kpis")


async def set_cached_kpis(kpis):
    await set_cache("kpis", kpis, ttl=60)
