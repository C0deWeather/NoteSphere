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
    