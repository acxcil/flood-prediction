import os
import requests
import pandas as pd
from dotenv import load_dotenv
from joblib import load
from simulation.fetcher import fetch_forecast
from simulation.hybrid import run_forecast_pipeline
from simulation.fuzzy_sim import load_fuzzy_sim

# Load environment variables (.env file)
load_dotenv()

# Load API key and ML components
api_key = os.getenv("OWM_API_KEY")
cal_pipe = load("backend/models/hybrid_calibrated_pipeline.pkl")
sim = load_fuzzy_sim()
best_thr = 0.6  # Set your tuned threshold from model training

def main():
    # Step 1: Fetch forecast
    df_raw = fetch_forecast(api_key, days=3)
    if df_raw.empty:
        print("⚠️ No forecast data returned. Exiting.")
        return

    # Step 2: Run fuzzy + ML hybrid model
    df_results = run_forecast_pipeline(df_raw, cal_pipe, sim, best_thr)

    # Step 3: Combine features + predictions
    df_final = pd.concat([df_raw, df_results], axis=1)

    # Step 4: Prepare and POST to backend
    records = [
        {
            "region": row["Region"].lower(),
            "forecast_date": str(row["Date"].date()),
            "prob_hybrid": float(row["prob_hybrid"]),
            "alert": int(row["alert"])
        }
        for _, row in df_final.iterrows()
    ]

    try:
        response = requests.post(
            "http://127.0.0.1:8000/forecast/upload",
            json=records,
            timeout=10
        )
        response.raise_for_status()
        print("✅ Uploaded to backend:", response.json())
    except Exception as e:
        print("❌ Upload failed:", e)

if __name__ == "__main__":
    main()
