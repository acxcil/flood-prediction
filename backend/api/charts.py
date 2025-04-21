from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.core.database import get_db
from backend.db_models.forecast import Forecast
from config.regions_config import REGIONS

router = APIRouter()

@router.get("/status")
def latest_status(db: Session = Depends(get_db)):
    latest = db.query(Forecast.forecast_date).order_by(Forecast.forecast_date.desc()).first()
    if not latest:
        raise HTTPException(status_code=404, detail="No forecast data")

    records = db.query(Forecast).filter(Forecast.forecast_date == latest[0]).all()

    def label(score):
        if score > 0.8:
            return "High"
        elif score > 0.5:
            return "Moderate"
        return "Low"

    return [
        {
            "region": f.region,
            "risk_score": f.prob_hybrid,
            "alert_level": label(f.prob_hybrid),
            "lat": REGIONS.get(f.region, {}).get("lat"),
            "lon": REGIONS.get(f.region, {}).get("lon")
        }
        for f in records
    ]

@router.get("/risk-summary")
def risk_summary(db: Session = Depends(get_db)):
    latest = db.query(Forecast.forecast_date).order_by(Forecast.forecast_date.desc()).first()
    if not latest:
        raise HTTPException(status_code=404, detail="No forecast data")

    records = db.query(Forecast).filter(Forecast.forecast_date == latest[0]).all()

    summary = {"Low": 0, "Moderate": 0, "High": 0}
    for f in records:
        if f.prob_hybrid > 0.8:
            summary["High"] += 1
        elif f.prob_hybrid > 0.5:
            summary["Moderate"] += 1
        else:
            summary["Low"] += 1
    return summary

@router.get("/historical")
def historical_forecasts(
    region: str = Query(None),
    days: int = 30,
    db: Session = Depends(get_db)
):
    cutoff = datetime.utcnow().date() - timedelta(days=days)
    
    query = db.query(Forecast).filter(Forecast.forecast_date >= cutoff)

    if region:
        query = query.filter(Forecast.region == region.lower())

    results = query.order_by(Forecast.forecast_date).all()

    return [
        {
            "region": f.region,
            "date": str(f.forecast_date),
            "risk_score": f.prob_hybrid,
            "alert": f.alert,
            "lat": REGIONS.get(f.region, {}).get("lat"),
            "lon": REGIONS.get(f.region, {}).get("lon")
        }
        for f in results
    ]
