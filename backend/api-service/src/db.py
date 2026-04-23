from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from shared.models import Base
from backend.shared.config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_session() -> Session:
    return SessionLocal()


def init_db():
    Base.metadata.create_all(bind=engine)
