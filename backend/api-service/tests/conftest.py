import sys
import os

_ROOT = '/workspace/2d51fa49-22fe-46ec-b2ce-7c3e9e5eddf8'
sys.path.insert(0, _ROOT)

import importlib
for mod_name in list(sys.modules.keys()):
    if mod_name == 'shared' or mod_name.startswith('shared.'):
        del sys.modules[mod_name]

for path in sys.path:
    if '/app/shared' in path:
        sys.path.remove(path)
        break

os.environ['DATABASE_URL'] = 'sqlite:///./test.db'

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    from shared.models import Base
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    from backend.api_service.src.main import app
    from backend.api_service.src.db import get_db_session
    from backend.api_service.src.dependencies import get_db

    def override_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def db_session():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()
