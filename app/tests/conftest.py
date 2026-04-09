import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def signup_payload():
    return {
        "first_name": "John",
        "email": "user@example.com",
        "password": "password123",
    }

@pytest.fixture
def login_payload():
    return {
        "email": "user@example.com",
        "password": "password123",
    }
