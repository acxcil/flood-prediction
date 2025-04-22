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
        from_attributes = True

class PredictionRequest(BaseModel):
    Precipitation: float
    Elevation_m: float
    Slope_deg: float
    Drainage_Density: float
    Dist_to_River_km: float
    Soil_Type: str
    Land_Cover: str
    TWI: float
    NDVI: float
    month_sin: float
    month_cos: float
    Precipitation_norm: float
    River_Level_norm: float
    Fuzzy_Risk: float

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
