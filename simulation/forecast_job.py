import os
import requests
import pandas as pd
from fetcher import fetch_forecast
from hybrid import run_forecast_pipeline

def main():
    api_key = os.getenv("OWM_API_KEY")
    fc_raw = fetch_forecast(api_key, days=3)
    results = run_forecast_pipeline(fc_raw)

    # Add region and date back for each row
    results["region"] = fc_raw["Region"]
    results["forecast_date"] = pd.Timestamp.now().date()

    # Prepare JSON payload
    payload = results[["region", "forecast_date", "prob_hybrid", "alert"]].to_dict(orient="records")

    # Post to backend
    resp = requests.post(
        "http://127.0.0.1:8000/flood-forecasts",  # Use full IP/hostname in deployment
        json=payload,
        timeout=10
    )
    resp.raise_for_status()
    print("✅ Forecasts pushed:", resp.status_code)

if __name__ == "__main__":
    main()
