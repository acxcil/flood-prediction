import os
import requests
import pandas as pd
from dotenv import load_dotenv
from joblib import load

from simulation.fetcher import fetch_forecast
from simulation.hybrid import run_forecast_pipeline
from simulation.fuzzy_sim import load_fuzzy_sim

# Load environment variables
load_dotenv()
api_key = os.getenv("OWM_API_KEY")

# Load ML model and Fuzzy logic components
cal_pipe = load("backend/models/hybrid_calibrated_pipeline.pkl")
sim = load_fuzzy_sim()
best_thr = 0.71  # tuned threshold

def main():
    print("🌦️  Fetching forecast data...")
    df_raw, failed_regions = fetch_forecast(api_key, days=3)

    if df_raw.empty:
        print("⚠️  No forecast data returned. Exiting.")
        return

    print("🧠 Running hybrid model...")
    df_results = run_forecast_pipeline(df_raw, cal_pipe, sim, best_thr)

    df_final = pd.concat([df_raw, df_results], axis=1)

    records = [
        {
            "region": row["Region"].lower(),
            "forecast_date": str(row["Date"].date()),
            "prob_hybrid": float(row["prob_hybrid"]),
            "alert": int(row["alert"])
        }
        for _, row in df_final.iterrows()
    ]

    print(f"📡 Uploading {len(records)} forecasts to backend...")
    try:
        response = requests.post(
            "http://127.0.0.1:8000/forecast/upload",
            json=records,
            timeout=10
        )
        response.raise_for_status()
        print("✅ Upload successful:", response.json())
    except Exception as e:
        print("❌ Upload failed:", e)

    if failed_regions:
        print(f"⚠️ Forecast failed for {len(failed_regions)} regions. See data/failed_regions.txt")

if __name__ == "__main__":
    main()
