from sqlalchemy import Column, Integer, String, Float, Date
from backend.core.database import Base

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    forecast_date = Column(Date, nullable=False)
    prob_hybrid = Column(Float, nullable=False)
    alert = Column(Integer, nullable=False)  # 0 or 1
