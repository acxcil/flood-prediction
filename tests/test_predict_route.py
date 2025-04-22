
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_predict_route_with_13_features():
    payload = {
        "Precipitation": 3.2,
        "Elevation_m": 950,
        "Slope_deg": 6.5,
        "Drainage_Density": 2.1,
        "Dist_to_River_km": 1.0,
        "Soil_Type": "loam",
        "Land_Cover": "urban",
        "TWI": 12.5,
        "NDVI": 0.35,
        "month_sin": 0.5,
        "month_cos": 0.866,
        "Precipitation_norm": 0.64,
        "River_Level_norm": 0.64,
        "Fuzzy_Risk": 0.7 # 
    }

    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "alert_level" in data

    assert isinstance(data["risk_score"], float)
    assert data["alert_level"] in ["Low", "Moderate", "High"]
