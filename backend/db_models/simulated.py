from sqlalchemy import Column, Integer, String, Float, Date
from backend.core.database import Base

class SimulatedHistory(Base):
    __tablename__ = "simulated_history"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    sim_date = Column(Date, nullable=False)
    risk_score = Column(Float, nullable=False)
    flood_status = Column(Integer, nullable=False)  # 0 or 1
