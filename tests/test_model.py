import joblib
import pandas as pd

def test_model_prediction():
    model = joblib.load("backend/models/hybrid_calibrated_pipeline.pkl")

    X_sample = pd.DataFrame([{
        "Precipitation": 5.0,
        "Elevation_m": 1000,
        "Slope_deg": 10.0,
        "Drainage_Density": 2.5,
        "Dist_to_River_km": 0.5,
        "Soil_Type": "loam",
        "Land_Cover": "urban",
        "TWI": 13.0,
        "NDVI": 0.4,
        "month_sin": 0.5,
        "month_cos": 0.86,
        "Precipitation_norm": 0.6,
        "River_Level_norm": 0.6,
        "Fuzzy_Risk": 0.75  #  Needed by model pipeline
    }])

    proba = model.predict_proba(X_sample)
    assert proba.shape == (1, 2)
