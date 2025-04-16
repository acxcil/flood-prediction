import logging
from typing import Dict, List, Any, Tuple, Optional
import numpy as np
from api.utils.model_loader import model_loader
from api.core.errors import PredictionError, ValidationError

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model_loader = model_loader
    
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make a single prediction
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Dictionary with prediction results
        """
        try:
            # Validate required features
            self._validate_features(features)
            
            # Make prediction
            prediction, probability = self.model_loader.predict(features)
            
            # Determine risk level
            risk_level = self._get_risk_level(probability)
            
            # Return response
            return {
                "prediction": prediction,
                "probability": probability,
                "risk_level": risk_level,
                "features_used": list(features.keys())
            }
        except ValidationError as e:
            raise e
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise PredictionError(f"Prediction failed: {str(e)}")
    
    def batch_predict(self, features_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Make predictions for multiple inputs
        
        Args:
            features_list: List of feature dictionaries
            
        Returns:
            Dictionary with predictions and summary
        """
        try:
            predictions = []
            for features in features_list:
                predictions.append(self.predict(features))
            
            # Calculate summary statistics
            summary = self._calculate_summary(predictions)
            
            return {
                "predictions": predictions,
                "summary": summary
            }
        except Exception as e:
            logger.error(f"Batch prediction failed: {e}")
            raise PredictionError(f"Batch prediction failed: {str(e)}")
    
    def _validate_features(self, features: Dict[str, Any]):
        """Validate that required features are present"""
        required_features = [
            "temperature", "precipitation", "snowmelt", "soil_moisture", 
            "river_level", "days_since_precip", "precip_3d", "precip_7d", 
            "precip_14d", "river_level_change"
        ]
        
        missing_features = [f for f in required_features if f not in features]
        
        if missing_features:
            raise ValidationError(f"Missing required features: {', '.join(missing_features)}")
    
    def _calculate_summary(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate summary statistics for a batch of predictions"""
        if not predictions:
            return {"count": 0}
        
        flood_count = sum(1 for p in predictions if p["prediction"] == 1)
        probabilities = [p["probability"] for p in predictions]
        
        return {
            "count": len(predictions),
            "flood_count": flood_count,
            "flood_percentage": round(100 * flood_count / len(predictions), 2),
            "avg_probability": round(np.mean(probabilities), 4),
            "max_probability": round(max(probabilities), 4),
            "risk_levels": {
                "high": sum(1 for p in predictions if p["risk_level"] == "High"),
                "medium": sum(1 for p in predictions if p["risk_level"] == "Medium"),
                "low": sum(1 for p in predictions if p["risk_level"] == "Low")
            }
        }

    def get_risk_trend(self, region: str, days: int = 7) -> Dict[str, List[Any]]:
        """
        Generate a simulated risk trend for a region
        
        Args:
            region: Region name
            days: Number of days to generate
            
        Returns:
            Dictionary with dates and risk values
        """
        try:
            # In a real system, this would use actual historical data
            # For this demo, we'll simulate a trend
            import datetime
            
            today = datetime.datetime.now()
            dates = [(today - datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)]
            dates.reverse()  # Start from oldest date
            
            # Generate a plausible trend for the given region
            # Start with a base probability and add some random variation with a trend
            base_probability = 0.3
            if "flood" in region.lower() or "river" in region.lower():
                base_probability = 0.5  # Higher base for regions with flood/river in the name
            
            # Create a trend with some randomness
            trend = np.linspace(0, 0.2, days)  # Increasing trend
            noise = np.random.normal(0, 0.1, days)  # Random noise
            
            probabilities = np.clip(base_probability + trend + noise, 0.05, 0.95)
            probabilities = [round(float(p), 4) for p in probabilities]
            
            # Convert to risk levels
            risk_levels = [self._get_risk_level(p) for p in probabilities]
            
            return {
                "dates": dates,
                "probabilities": probabilities,
                "risk_levels": risk_levels
            }
        except Exception as e:
            logger.error(f"Error generating risk trend: {e}")
            raise PredictionError(f"Failed to generate risk trend: {str(e)}")

# Singleton instance to be used across the application
prediction_service = PredictionService()