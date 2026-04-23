import os


def get_env(key: str, default=None):
    return os.environ.get(key, default)


def get_env_int(key: str, default=None):
    val = os.environ.get(key)
    if val is None:
        if default is None:
            raise ValueError(f"Environment variable {key} is required")
        return default
    try:
        return int(val)
    except ValueError:
        raise ValueError(f"Environment variable {key} must be an integer")


API_BASE_URL = get_env("VITE_API_URL", "http://localhost:8001")
