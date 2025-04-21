from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_admin_requires_token():
    res = client.post("/admin/ingest")
    assert res.status_code in [401, 403]

def test_admin_ping_requires_token():
    res = client.get("/admin/ping")
    assert res.status_code in [401, 403]
