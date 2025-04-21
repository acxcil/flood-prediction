from pydantic import BaseModel
from datetime import date

# Input from forecast_job.py
class ForecastIn(BaseModel):
    region: str
    forecast_date: date
    prob_hybrid: float
    alert: int

# Used in GET endpoint
class ForecastOut(BaseModel):
    region: str
    forecast_date: date
    prob_hybrid: float
    alert: int
    risk_level: str

    class Config:
        orm_mode = True

class PredictionRequest(BaseModel):
    precipitation: float
    river_level: float
    temperature: float
    soil_moisture: float

class PredictionResponse(BaseModel):
    risk_score: float
    alert_level: str

class ForecastResponse(BaseModel):
    region: str
    risk_level: str
    forecast_date: str

class ForecastUploadRequest(BaseModel):
    region: str
    forecast_date: date
    prob_hybrid: float
    alert: int