from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_login_and_auth_me():
    # Register user (skip if already exists)
    register_data = {"email": "testuser@example.com", "password": "testpass123"}
    client.post("/users/", json=register_data)

    # Login
    login_res = client.post("/auth/login", json=register_data)
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Get /auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == register_data["email"]
