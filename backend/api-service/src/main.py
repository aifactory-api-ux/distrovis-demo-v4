from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db import init_db, get_db_session
from src.api.endpoints import router
from src.cache import close_cache
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from backend.shared.utils import seed_database, seed_data_exists


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = get_db_session()
    try:
        if not seed_data_exists(db):
            seed_database(db)
    finally:
        db.close()
    yield
    await close_cache()


app = FastAPI(title="Distrovis API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}
