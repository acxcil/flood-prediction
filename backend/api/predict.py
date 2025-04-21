import joblib
from fastapi import APIRouter, Request
from backend.schemas.forecast import PredictionRequest, PredictionResponse

router = APIRouter()
model = joblib.load("backend/models/hybrid_calibrated_pipeline.pkl")

@router.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    features = [[
        data.precipitation,
        data.river_level,
        data.temperature,
        data.soil_moisture
    ]]
    risk_score = model.predict_proba(features)[0][1]
    alert = "High" if risk_score > 0.8 else "Moderate" if risk_score > 0.5 else "Low"
    return {"risk_score": risk_score, "alert_level": alert}
