# api/routes/prediction.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
import logging

from api.models.prediction import (
    PredictionRequest, 
    BatchPredictionRequest, 
    PredictionResponse, 
    BatchPredictionResponse,
    RiskTrend
)
from api.services.prediction_service import prediction_service
from api.core.errors import PredictionError, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/prediction",
    tags=["prediction"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Prediction error"}
    }
)

@router.post("/predict", response_model=PredictionResponse, status_code=200)
async def predict(request: PredictionRequest):
    """
    Make a single flood prediction based on input features.
    
    This endpoint accepts environmental and hydrological data and returns
    a prediction of whether a flood is likely to occur.
    """
    try:
        logger.info(f"Received prediction request for region: {request.region}")
        
        # Use model_dump() as recommended in Pydantic V2
        features = request.model_dump()
        
        # Make prediction
        result = prediction_service.predict(features)
        
        logger.info(f"Prediction result: {result['prediction']} with probability {result['probability']:.4f}")
        
        return result
    except ValidationError as e:
        logger.warning(f"Validation error in prediction request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except PredictionError as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in prediction endpoint: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.post("/batch-predict", response_model=BatchPredictionResponse, status_code=200)
async def batch_predict(request: BatchPredictionRequest):
    """
    Make predictions for multiple sets of input features.
    
    This endpoint accepts a batch of input data and returns predictions for each item,
    along with summary statistics for the batch.
    """
    try:
        if not request.data:
            raise ValidationError("Empty batch request")
        
        logger.info(f"Received batch prediction request with {len(request.data)} items")
        
        # Convert each Pydantic model using model_dump()
        features_list = [item.model_dump() for item in request.data]
        
        # Make batch prediction
        result = prediction_service.batch_predict(features_list)
        
        logger.info(f"Batch prediction complete. Predicted {result['summary']['flood_count']} floods out of {result['summary']['count']} items")
        
        return result
    except ValidationError as e:
        logger.warning(f"Validation error in batch prediction request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except PredictionError as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in batch prediction endpoint: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during batch prediction")

@router.get("/risk-trend/{region_id}", response_model=RiskTrend, status_code=200)
async def get_risk_trend(
    region_id: str,
    days: int = Query(7, description="Number of days to include in trend", ge=1, le=30)
):
    """
    Get the flood risk trend for a specific region over time.
    
    This endpoint returns historical or simulated risk levels for a specified region
    over a period of days, useful for visualizing trends in flood risk.
    """
    try:
        logger.info(f"Received risk trend request for region {region_id} over {days} days")
        result = prediction_service.get_risk_trend(region_id, days)
        logger.info(f"Generated risk trend for {region_id} with {len(result['dates'])} data points")
        return result
    except PredictionError as e:
        logger.error(f"Error generating risk trend: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in risk trend endpoint: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while generating risk trend")
