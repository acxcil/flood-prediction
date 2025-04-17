import joblib
import numpy as np
import pandas as pd
from typing import Dict, Tuple, List, Any
import os
import logging
from datetime import datetime
from api.core.config import settings

logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self):
        self.model = None
        self.feature_names = None
        self.preprocessor = None
        self.threshold = None
        self._load_model()
        self._load_feature_names()
        self._load_preprocessor()
    
    def _load_model(self):
        """Load the trained model from disk"""
        try:
            logger.info(f"Loading model from {settings.MODEL_PATH}")
            model_data = joblib.load(settings.MODEL_PATH)
            self.model = model_data['model']
            self.threshold = model_data.get('threshold', 0.5)
            logger.info(f"Model loaded with threshold: {self.threshold}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise RuntimeError(f"Failed to load model: {e}")
    
    def _load_feature_names(self):
        """Load feature names from disk"""
        try:
            with open(settings.FEATURE_NAMES_PATH, 'r') as f:
                self.feature_names = [line.strip() for line in f.readlines()]
            logger.info(f"Loaded {len(self.feature_names)} feature names")
        except Exception as e:
            logger.error(f"Error loading feature names: {e}")
            raise RuntimeError(f"Failed to load feature names: {e}")
    
    def _load_preprocessor(self):
        """Load the preprocessor from disk"""
        try:
            if os.path.exists(settings.PREPROCESSOR_PATH):
                self.preprocessor = joblib.load(settings.PREPROCESSOR_PATH)
                logger.info("Preprocessor loaded successfully")
            else:
                logger.warning("Preprocessor file not found, will use raw features")
        except Exception as e:
            logger.error(f"Error loading preprocessor: {e}")
            logger.warning("Will use raw features")
    
    def predict(self, features: Dict[str, Any]) -> Tuple[int, float]:
        """
        Make prediction using the loaded model
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Tuple of (prediction, probability)
        """
        try:
            # Convert input features to numpy array
            X = self._prepare_features(features)
            
            # Get prediction probability
            probability = self.model.predict_proba(X)[0, 1]
            
            # Apply threshold
            prediction = 1 if probability >= self.threshold else 0
            
            return prediction, float(probability)
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise RuntimeError(f"Prediction failed: {e}")
    
    def _prepare_features(self, features: Dict[str, Any]) -> np.ndarray:
        """Prepare features for prediction"""
        try:
            # Check for required fields
            required_fields = ['elevation_range', 'region', 'basin', 'month']
            missing_fields = [field for field in required_fields if field not in features]
            
            if missing_fields:
                raise ValueError(f"columns are missing: {set(missing_fields)}")
            
            # Create a dataframe with the right columns
            df = pd.DataFrame({name: [features.get(name, 0)] for name in self.feature_names})
            
            # Apply preprocessing if available
            if self.preprocessor is not None:
                X = self.preprocessor.transform(df)
            else:
                X = df.values
                
            return X
        except Exception as e:
            logger.error(f"Error preparing features: {e}")
            raise ValueError(f"Failed to prepare features: {e}")
    
    def batch_predict(self, features_list: List[Dict[str, Any]]) -> List[Tuple[int, float]]:
        """Make predictions for a batch of inputs"""
        return [self.predict(features) for features in features_list]

# Singleton instance to be used across the application
model_loader = ModelLoader()