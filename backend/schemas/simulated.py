from pydantic import BaseModel
from datetime import date

class SimulatedOut(BaseModel):
    region: str
    sim_date: date
    risk_score: float
    flood_status: int

    class Config:
        from_attributes = True
