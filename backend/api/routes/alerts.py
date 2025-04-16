# api/routes/alerts.py

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
import logging

from api.services.alerts_service import alerts_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/simulate", status_code=200)
async def simulate_alerts(threshold: float = Query(0.7, description="Alert threshold for flood risk probability")) -> Dict[str, Any]:
    """
    Simulate alerts based on a flood risk threshold.
    """
    try:
        alerts = alerts_service.simulate_alerts(threshold)
        return {"alerts": alerts}
    except Exception as e:
        logger.error(f"Error simulating alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to simulate alerts")
