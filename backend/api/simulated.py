from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.core.database import get_db
from backend.db_models.simulated import SimulatedHistory
from backend.schemas.simulated import SimulatedOut

router = APIRouter()

@router.get("/simulated/history", response_model=list[SimulatedOut])
def get_simulated_history(
    region: str = Query(...),
    days: int = 30,
    db: Session = Depends(get_db)
):
    cutoff = datetime.utcnow().date() - timedelta(days=days)
    records = (
        db.query(SimulatedHistory)
        .filter(SimulatedHistory.region == region)
        .filter(SimulatedHistory.sim_date >= cutoff)
        .order_by(SimulatedHistory.sim_date)
        .all()
    )
    return records
