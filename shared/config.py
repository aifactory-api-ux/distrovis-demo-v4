import os
from typing import Optional


def get_env(key: str, default: Optional[str] = None) -> str:
    value = os.environ.get(key)
    if value is None and default is None:
        raise ValueError(f"Environment variable {key} is required")
    return value or default


def get_env_int(key: str, default: Optional[int] = None) -> int:
    value = os.environ.get(key)
    if value is None:
        if default is None:
            raise ValueError(f"Environment variable {key} is required")
        return default
    try:
        return int(value)
    except ValueError:
        raise ValueError(f"Environment variable {key} must be an integer")


POSTGRES_HOST = get_env("POSTGRES_HOST", "postgres")
POSTGRES_PORT = get_env_int("POSTGRES_PORT", 5432)
POSTGRES_DB = get_env("POSTGRES_DB", "distroviz")
POSTGRES_USER = get_env("POSTGRES_USER", "distroviz")
POSTGRES_PASSWORD = get_env("POSTGRES_PASSWORD", "secretpassword")

REDIS_HOST = get_env("REDIS_HOST", "redis")
REDIS_PORT = get_env_int("REDIS_PORT", 6379)
REDIS_DB = get_env_int("REDIS_DB", 0)
REDIS_PASSWORD = get_env("REDIS_PASSWORD", "")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

API_PORT = get_env_int("API_PORT", 8001)
FRONTEND_PORT = get_env_int("FRONTEND_PORT", 3000)

REDIS_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}" if REDIS_PASSWORD else f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
