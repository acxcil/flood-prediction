# api/core/config.py
import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Flood Prediction System API"
    
    # Model paths
    MODEL_PATH: str = os.path.join("model", "final_flood_prediction_model.pkl")
    PREPROCESSOR_PATH: str = os.path.join("data", "processed_data", "preprocessor.pkl")
    
    # Data paths
    FEATURE_NAMES_PATH: str = os.path.join("data", "processed_data", "feature_names.txt")
    TRAIN_DATA_PATH: str = os.path.join("data", "processed_data", "train_data.csv")
    VALIDATION_DATA_PATH: str = os.path.join("data", "processed_data", "validation_data.csv")
    TEST_DATA_PATH: str = os.path.join("data", "processed_data", "test_data.csv")
    
    # Logging
    LOGGING_LEVEL: str = "INFO"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    model_config = ConfigDict(case_sensitive=True)

settings = Settings()
