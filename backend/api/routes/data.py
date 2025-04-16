from fastapi import APIRouter, HTTPException, Query, Path, Response
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
import io

import pandas as pd

from api.models.data import HistoricalDataResponse, DataStats, Region, RegionList
from api.services.data_service import data_service
from api.core.errors import DataError

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/data",
    tags=["data"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Server error"}
    }
)

@router.get("/historical", response_model=List[Dict[str, Any]], status_code=200)
async def get_historical_data(
    region_id: Optional[str] = Query(None, description="Filter by region ID"),
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    days: int = Query(30, description="Fallback number of days to retrieve if no date range provided", ge=1, le=365)
):
    """
    Get historical flood data, optionally filtered by region and a date range.
    
    This endpoint provides access to historical data that can be used for analysis
    or visualization of past flood events.
    """
    try:
        start_dt = datetime.strptime(start_date, '%Y-%m-%d') if start_date else None
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') if end_date else None
        
        logger.info(
            f"Fetching historical data for {days} days"
            + (f" in region {region_id}" if region_id else "")
            + (f" between {start_date} and {end_date}" if start_date and end_date else "")
        )
        
        data = data_service.get_historical_data(region_id, days, start_dt, end_dt)
        
        logger.info(f"Retrieved {len(data)} historical records")
        
        return data
    except DataError as e:
        logger.warning(f"Data error: {e}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error retrieving historical data: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving historical data")

@router.get("/stats", response_model=DataStats, status_code=200)
async def get_data_statistics():
    """
    Get statistics about the available flood data.
    
    This endpoint provides aggregate statistics about the flood data,
    useful for creating dashboards and summary reports.
    """
    try:
        logger.info("Fetching data statistics")
        
        stats = data_service.get_data_stats()
        
        logger.info("Retrieved data statistics successfully")
        
        return stats
    except DataError as e:
        logger.warning(f"Data statistics error: {e}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error retrieving data statistics: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving data statistics")

@router.get("/export", status_code=200)
async def export_data(
    format: str = Query("csv", description="Export format: csv or json"),
    region_id: Optional[str] = Query(None, description="Optional region filter")
):
    """
    Export historical data in CSV or JSON format.
    """
    try:
        # Get the data as a DataFrame
        df = data_service.get_data_as_dataframe(region_id)
        if format.lower() == "csv":
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            return Response(content=csv_buffer.getvalue(), media_type="text/csv")
        elif format.lower() == "json":
            json_str = df.to_json(orient="records")
            return Response(content=json_str, media_type="application/json")
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format. Use 'csv' or 'json'.")
    except DataError as e:
        logger.warning(f"Data export error: {e}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during data export: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during export")
