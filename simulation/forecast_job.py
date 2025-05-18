# simulation/forecast_job.py

import os
import sys
import argparse
import requests
import pandas as pd
from datetime import date
from dateutil import parser as date_parser      # ← alias here
from dotenv import load_dotenv
from joblib import load

from simulation.fetcher import fetch_forecast
from simulation.hybrid import run_forecast_pipeline
from simulation.fuzzy_sim import load_fuzzy_sim

# ─── Config ──────────────────────────────────────────────────────────────────
load_dotenv()
API_KEY     = os.getenv("OWM_API_KEY")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

cal_pipe = load("backend/models/hybrid_calibrated_pipeline.pkl")
sim       = load_fuzzy_sim()
BEST_THR  = 0.71

# ─── Helpers ─────────────────────────────────────────────────────────────────
def get_last_forecast_date():
    """Return the most recent forecast_date in the DB, or None if no data."""
    resp = requests.get(f"{BACKEND_URL}/forecast/latest", timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if not data:
        return None
    dates = [
        date_parser.parse(item["forecast_date"]).date()   # ← use date_parser
        for item in data
        if item.get("forecast_date")
    ]
    return max(dates) if dates else None

# ─── Main ────────────────────────────────────────────────────────────────────
def main(backfill_days=None):
    today     = date.today()
    last_date = get_last_forecast_date()

    if backfill_days is not None:
        days_to_fetch = backfill_days
        print(f"🔄 BACKFILL MODE: forcing fetch of last {days_to_fetch} day(s).")
    else:
        if last_date:
            days_to_fetch = (today - last_date).days
            if days_to_fetch <= 0:
                print(f"✅ Already up to date (last forecast: {last_date}). Exiting.")
                return
        else:
            days_to_fetch = 3
        print(f"🔎 Last forecast date in DB: {last_date or 'None (first run)'}")
        print(f"→ Will fetch {days_to_fetch} new day(s) (today is {today})")

    print(f"🌦️  Fetching forecast for last {days_to_fetch} day(s)…")
    df_raw, failed = fetch_forecast(API_KEY, days=days_to_fetch)
    if df_raw.empty:
        print("⚠️  No forecast data returned. Exiting.")
        return

    print("🧠 Running hybrid ML + fuzzy pipeline…")
    df_results = run_forecast_pipeline(df_raw, cal_pipe, sim, BEST_THR)
    df_final = pd.concat([df_raw, df_results], axis=1)

    records = [
        {
            "region":        row["Region"].lower(),
            "forecast_date": str(row["Date"].date()),
            "prob_hybrid":   float(row["prob_hybrid"]),
            "alert":         int(row["alert"]),
        }
        for _, row in df_final.iterrows()
    ]

    print(f"📡 Uploading {len(records)} records to backend…")
    try:
        resp = requests.post(
            f"{BACKEND_URL}/forecast/upload",
            json=records,
            timeout=30
        )
        resp.raise_for_status()
        print("✅ Upload successful:", resp.json())
    except Exception as e:
        print("❌ Upload failed:", e)

    if failed:
        print(f"⚠️ Forecast failed for {len(failed)} regions. Inspect `data/failed_regions.txt` if present.")

if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser(
        description="Run daily flood forecast ingestion. By default it only fetches days since last DB entry."
    )
    arg_parser.add_argument(
        "--backfill-days", "-b",
        type=int,
        help="Force fetching this many days of data (ignores last-forecast check)."
    )
    args = arg_parser.parse_args()
    main(backfill_days=args.backfill_days)
