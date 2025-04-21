from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from backend.core.database import get_db
from backend.schemas.forecast import ForecastIn, ForecastOut, ForecastUploadRequest
from backend.db_models.forecast import Forecast

router = APIRouter()


@router.post("/flood-forecasts")
def post_forecasts(forecasts: list[ForecastIn], db: Session = Depends(get_db)):
    for item in forecasts:
        db_forecast = Forecast(**item.dict())
        db.add(db_forecast)
    db.commit()
    return {"detail": f"✅ Saved {len(forecasts)} forecasts"}


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


@router.post("/forecast/upload")
def upload_forecasts(data: list[ForecastUploadRequest], db: Session = Depends(get_db)):
    inserted = 0
    for item in data:
        forecast = Forecast(
            region=item.region.lower(),
            forecast_date=item.forecast_date,
            prob_hybrid=item.prob_hybrid,
            alert=item.alert
        )
        db.add(forecast)
        inserted += 1

    db.commit()
    return {"message": f"✅ Uploaded {inserted} forecasts"}


@router.get("/forecast/{region}", response_model=list[ForecastOut])
def forecast_by_region(
    region: str,
    days: int = Query(default=None, ge=1, le=30),
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: Session = Depends(get_db)
):
    region = region.lower()
    query = db.query(Forecast).filter(Forecast.region == region)

    if start_date and end_date:
        query = query.filter(Forecast.forecast_date >= start_date).filter(Forecast.forecast_date <= end_date)
    elif days:
        cutoff = date.today() - timedelta(days=days)
        query = query.filter(Forecast.forecast_date >= cutoff)
    else:
        # Default: last 3 days
        cutoff = date.today() - timedelta(days=3)
        query = query.filter(Forecast.forecast_date >= cutoff)

    forecasts = query.order_by(Forecast.forecast_date).all()

    if not forecasts:
        raise HTTPException(status_code=404, detail="No forecasts found for this region and filter")

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
