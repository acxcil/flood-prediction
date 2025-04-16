from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Dict, Any, Optional
import logging

from api.models.data import Region, RegionList
from api.services.data_service import data_service
from api.core.errors import DataError

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/regions",
    tags=["regions"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Server error"}
    }
)

@router.get("/", response_model=List[Region], status_code=200)
async def get_all_regions():
    """
    Get all regions with their current flood risk status.
    
    This endpoint returns all monitored regions along with their current
    flood risk levels and other relevant information.
    """
    try:
        logger.info("Fetching all regions")
        
        regions = data_service.get_regions()
        
        logger.info(f"Retrieved {len(regions)} regions")
        
        return regions
    except DataError as e:
        logger.warning(f"Data error: {e}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error retrieving regions: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving regions")

@router.get("/{region_id}", response_model=Region, status_code=200)
async def get_region_by_id(
    region_id: str = Path(..., description="The ID of the region to retrieve")
):
    """
    Get detailed information about a specific region.
    
    This endpoint returns detailed information about a single region,
    including current river levels and flood risk assessment.
    """
    try:
        logger.info(f"Fetching region with ID: {region_id}")
        
        region = data_service.get_region_by_id(region_id)
        
        logger.info(f"Retrieved region: {region['name']}")
        
        return region
    except DataError as e:
        logger.warning(f"Data error: {e}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error retrieving region: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while retrieving region {region_id}")