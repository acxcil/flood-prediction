# api/models/prediction.py
from pydantic import BaseModel, Field
from typing import Dict, Any, List

class PredictionRequest(BaseModel):
    """Request model for single prediction"""
    temperature: float = Field(..., description="Current temperature in Celsius")
    precipitation: float = Field(..., description="Precipitation amount in mm")
    snowmelt: float = Field(..., description="Snowmelt amount in mm of water equivalent")
    soil_moisture: float = Field(..., description="Soil moisture percentage")
    river_level: float = Field(..., description="Current river level in meters")
    days_since_precip: float = Field(..., description="Days since last significant precipitation")
    precip_3d: float = Field(..., description="Precipitation over last 3 days in mm")
    precip_7d: float = Field(..., description="Precipitation over last 7 days in mm")
    precip_14d: float = Field(..., description="Precipitation over last 14 days in mm")
    river_level_change: float = Field(..., description="Change in river level over last 24h")
    region: str = Field(..., description="Geographic region name")
    basin: str = Field(..., description="River basin name")
    elevation_range: str = Field(..., description="Elevation range category")
    month: int = Field(..., description="Month of the year (1-12)", ge=1, le=12)
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "temperature": 15.2,
                "precipitation": 5.8,
                "snowmelt": 0.0,
                "soil_moisture": 68.5,
                "river_level": 3.2,
                "days_since_precip": 1.0,
                "precip_3d": 12.5,
                "precip_7d": 28.7,
                "precip_14d": 42.3,
                "river_level_change": 0.8,
                "region": "Batken_Area",
                "basin": "Ferghana",
                "elevation_range": "medium",
                "month": 4
            }
        }
    }

class BatchPredictionRequest(BaseModel):
    """Request model for batch predictions"""
    data: List[PredictionRequest]

class PredictionResponse(BaseModel):
    """Response model for single prediction"""
    prediction: int = Field(..., description="Flood prediction (0=No Flood, 1=Flood)")
    probability: float = Field(..., description="Probability of flooding")
    risk_level: str = Field(..., description="Risk level category")
    features_used: List[str] = Field(..., description="Features used for prediction")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "prediction": 1,
                "probability": 0.78,
                "risk_level": "High",
                "features_used": ["temperature", "precipitation", "snowmelt", "soil_moisture", "river_level"]
            }
        }
    }

class BatchPredictionResponse(BaseModel):
    """Response model for batch predictions"""
    predictions: List[PredictionResponse]
    summary: Dict[str, Any] = Field(..., description="Summary statistics of predictions")

class RiskTrend(BaseModel):
    """Model representing risk trend over time"""
    dates: List[str]
    probabilities: List[float]
    risk_levels: List[str]
