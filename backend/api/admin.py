from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date as dt_date
from backend.core.database import get_db
from backend.db_models.forecast import Forecast
from backend.core.security import get_current_admin_user
import subprocess

router = APIRouter()

# 1. View all forecasts (admin only)
@router.get("/forecasts/all")
def get_all_forecasts(
    region: str | None = Query(None),
    start_date: dt_date | None = Query(None),
    end_date: dt_date | None = Query(None),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin_user)
):
    query = db.query(Forecast)
    if region:
        query = query.filter(Forecast.region == region.lower())
    if start_date:
        query = query.filter(Forecast.forecast_date >= start_date)
    if end_date:
        query = query.filter(Forecast.forecast_date <= end_date)

    forecasts = query.order_by(Forecast.forecast_date.desc()).all()
    return [
        {
            "region": f.region,
            "date": str(f.forecast_date),
            "risk_score": f.prob_hybrid,
            "alert": f.alert
        }
        for f in forecasts
    ]

# 2. Trigger forecast job manually (admin only)
@router.post("/admin/ingest")
def trigger_forecast_job(current_admin=Depends(get_current_admin_user)):
    try:
        result = subprocess.run(
            ["python", "simulation/forecast_job.py"],
            capture_output=True,
            text=True,
            timeout=120
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr)
        return {"message": "✅ Forecast job triggered", "stdout": result.stdout}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {str(e)}")

# 3. Delete old forecasts (admin only)
@router.delete("/admin/cleanup")
def cleanup_old_forecasts(
    days: int = 60,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin_user)
):
    cutoff = datetime.utcnow().date() - timedelta(days=days)
    deleted = db.query(Forecast).filter(Forecast.forecast_date < cutoff).delete()
    db.commit()
    return {"message": f"🧹 Deleted {deleted} forecasts older than {days} days."}

# 4. Ping endpoint for admin auth check
@router.get("/admin/ping")
def admin_ping(current_admin=Depends(get_current_admin_user)):
    return {"message": "🔐 Admin access confirmed!"}
