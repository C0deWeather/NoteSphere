from jose import jwt
from app.core.config import settings

def test_succesful_signup(client, signup_payload):
    response = client.post("api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 201

def test_signup_with_existing_email(client, signup_payload):
    # First signup should succeed
    response = client.post("api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 201

    # Second signup with the same email should fail
    response = client.post("api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"

def test_successful_login(client, login_payload, signup_payload):
    # Create user
    client.post("api/v1/auth/signup", json=signup_payload)

    # Verify login
    response = client.post("api/v1/auth/login", json=login_payload)
    assert response.status_code == 200

    # Verify jwt
    token = response.json()["access_token"]
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    assert payload["sub"] == login_payload["email"]

def test_login_with_invalid_email(client, login_payload, signup_payload):
    login_payload["email"] = "someusr@example.com"

    response = client.post("api/v1/auth/login", json=login_payload)
    assert response.status_code == 401

def test_login_with_invalid_passwd(client, login_payload, signup_payload):
    # Create user
    client.post("api/v1/auth/signup", json=signup_payload)

    login_payload["password"] = "wrong_password"

    response = client.post("api/v1/auth/login", json=login_payload)
    assert response.status_code == 401

