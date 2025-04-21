from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.forecast import ForecastIn, ForecastOut
from backend.db_models.forecast import Forecast
from datetime import date

router = APIRouter()

# POST: Save forecasts to DB
@router.post("/flood-forecasts")
def post_forecasts(forecasts: list[ForecastIn], db: Session = Depends(get_db)):
    for item in forecasts:
        db_forecast = Forecast(**item.dict())
        db.add(db_forecast)
    db.commit()
    return {"detail": f"✅ Saved {len(forecasts)} forecasts"}

# GET: Return latest forecasts from DB
@router.get("/forecast/latest", response_model=list[ForecastOut])
def get_latest_forecast(db: Session = Depends(get_db)):
    latest_date = db.query(Forecast.forecast_date).order_by(Forecast.forecast_date.desc()).first()
    if not latest_date:
        raise HTTPException(status_code=404, detail="No forecast available")
    forecasts = db.query(Forecast).filter(Forecast.forecast_date == latest_date[0]).all()

    def risk_level(prob):
        return "High" if prob > 0.8 else "Moderate" if prob > 0.5 else "Low"

    return [
        ForecastOut(
            region=f.region,
            forecast_date=f.forecast_date,
            prob_hybrid=f.prob_hybrid,
            alert=f.alert,
            risk_level=risk_level(f.prob_hybrid)
        ) for f in forecasts
    ]
