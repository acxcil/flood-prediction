from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date as dt_date
from backend.core.database import get_db
from backend.db_models.forecast import Forecast

router = APIRouter()

@router.get("/forecasts/all")
def get_all_forecasts(
    region: str | None = Query(None),
    start_date: dt_date | None = Query(None),
    end_date: dt_date | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Forecast)
    if region:
        query = query.filter(Forecast.region == region)
    if start_date:
        query = query.filter(Forecast.forecast_date >= start_date)
    if end_date:
        query = query.filter(Forecast.forecast_date <= end_date)

    forecasts = query.order_by(Forecast.forecast_date.desc()).all()

    return [
        {"region": f.region, "date": str(f.forecast_date), "risk_score": f.prob_hybrid, "alert": f.alert}
        for f in forecasts
    ]
