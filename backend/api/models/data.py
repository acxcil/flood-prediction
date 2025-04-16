# api/models/data.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any

class Region(BaseModel):
    """Model representing a geographic region"""
    id: str
    name: str
    basin: str
    elevation_range: str
    flood_threshold: float
    current_river_level: float
    risk_level: str
    coordinates: Dict[str, float]
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "batken",
                "name": "Batken Area",
                "basin": "Ferghana",
                "elevation_range": "medium",
                "flood_threshold": 4.5,
                "current_river_level": 3.2,
                "risk_level": "Medium",
                "coordinates": {"lat": 40.0625, "lon": 70.4252}
            }
        }
    }

class RegionList(BaseModel):
    """Model for a list of regions with metadata"""
    regions: List[Region]
    count: int
    high_risk_count: int

class HistoricalData(BaseModel):
    """Model for historical flood data"""
    date: str
    region: str
    river_level: float
    precipitation: float
    temperature: float
    flood_status: int
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "date": "2022-04-15",
                "region": "Batken Area",
                "river_level": 3.8,
                "precipitation": 8.5,
                "temperature": 15.3,
                "flood_status": 1
            }
        }
    }

class HistoricalDataResponse(BaseModel):
    """Response model for historical data"""
    data: List[HistoricalData]
    metadata: Dict[str, Any]

class DataStats(BaseModel):
    """Model for data statistics"""
    region_stats: Dict[str, Dict[str, Any]]
    overall_stats: Dict[str, Any]
    time_series: Dict[str, List[Any]]
