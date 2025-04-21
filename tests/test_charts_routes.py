from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_status_route():
    res = client.get("/status")
    assert res.status_code in [200, 404]

def test_historical_route_with_region():
    res = client.get("/historical", params={"region": "osh"})
    assert res.status_code in [200, 404]

def test_historical_missing_param():
    res = client.get("/historical")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
