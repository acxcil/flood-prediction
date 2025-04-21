from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_regions():
    res = client.get("/regions")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert "lat" in res.json()[0]

def test_get_status():
    res = client.get("/status")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_forecast_latest():
    res = client.get("/forecast/latest")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_historical_with_param():
    res = client.get("/historical?region=osh")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_historical_without_param():
    res = client.get("/historical")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
