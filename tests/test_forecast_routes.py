from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_latest_forecast():
    res = client.get("/forecast/latest")
    assert res.status_code in [200, 404]

def test_get_forecast_region_and_date_range():
    res = client.get("/forecast/osh", params={"start_date": "2024-01-01", "end_date": "2025-12-31"})
    assert res.status_code in [200, 404]
