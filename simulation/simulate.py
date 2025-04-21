# simulation/simulate.py

import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler
from config.regions_config import REGIONS  # now a dict of dicts

# For reproducibility
np.random.seed(42)

# Simulation timeframe
START_DATE = "2015-01-01"
END_DATE   = "2020-12-31"
DATES      = pd.date_range(START_DATE, END_DATE, freq="D")

# Output folder for raw data
RAW_DIR = Path("data/raw")
RAW_DIR.mkdir(parents=True, exist_ok=True)

def simulate_region(name, static):
    """
    Simulate daily time series for one region using:
     - static: dict of elevation_m, slope_deg, drainage_density, dist_to_river_km,
               soil_type, land_cover, TWI, NDVI, has_lake, has_dam
     - precipitation: sinusoid + melt bump + noise
     - river level: 7-day rolling precip + noise
     - optional lake/dam levels
     - risk_score + region‑seasonal threshold for Flood_Status
    """
    doy = DATES.dayofyear
    n   = len(DATES)

    # 1) Synthetic precipitation
    base_precip = np.random.uniform(1, 5)
    amp_precip  = np.random.uniform(8, 15)
    melt_peak   = np.random.randint(145, 160)
    melt_std    = np.random.uniform(15, 30)
    noise_p     = np.random.normal(0, 3, n)

    seasonal    = base_precip + amp_precip * np.sin(2 * np.pi * doy / 365)
    melt_spike  = amp_precip * 0.5 * np.exp(-((doy - melt_peak)**2) / (2 * melt_std**2))
    P           = np.clip(seasonal + melt_spike + noise_p, 0, None)

    # 2) River level
    RL = (
        2
        + 0.1 * pd.Series(P).rolling(7, min_periods=1).sum().values
        + np.random.normal(0, 0.5, n)
    )

    # Build DataFrame
    df = pd.DataFrame({
        "Date":          DATES,
        "Region":        name,
        "Precipitation": P,
        "River_Level":   RL,
        # Static terrain fields passed through
        "Elevation_m":      static["elevation_m"],
        "Slope_deg":        static["slope_deg"],
        "Drainage_Density": static["drainage_density"],
        "Dist_to_River_km": static["dist_to_river_km"],
        "Soil_Type":        static["soil_type"],
        "Land_Cover":       static["land_cover"],
        "TWI":              static["TWI"],
        "NDVI":             static["NDVI"],
    })

    # 3) Lake & Dam levels
    if static["has_lake"]:
        df["Lake_Level"] = (
            5
            + 0.08 * pd.Series(P).rolling(10, min_periods=1).mean().values
            + np.random.normal(0, 0.4, n)
        )
    if static["has_dam"]:
        df["Dam_Level"] = (
            10
            + 0.05 * pd.Series(P).rolling(14, min_periods=1).mean().values
            + np.random.normal(0, 0.3, n)
        )

    # 4) Compute normalized predictors & risk_score
    scaler = MinMaxScaler()
    cols   = ["Precipitation", "River_Level", "Slope_deg",
              "Dist_to_River_km", "TWI", "NDVI"]
    df[[c + "_norm" for c in cols]] = scaler.fit_transform(df[cols])

    df["risk_score"] = (
        0.4 * df["Precipitation_norm"]
      + 0.4 * df["River_Level_norm"]
      + 0.1 * df["Slope_deg_norm"]
      + 0.05 * (1 - df["Dist_to_River_km_norm"])
      + 0.05 * df["TWI_norm"]
    )

    # 5) Region‑seasonal threshold (Apr–Jul 75th pct)
    season_mask = df["Date"].dt.month.isin([4, 5, 6, 7])
    thresh      = df.loc[season_mask, "risk_score"].quantile(0.75)
    df["Flood_Status"] = (df["risk_score"] >= thresh).astype(int)

    return df

def main():
    frames = []
    for region_name, static in REGIONS.items():
        df_region = simulate_region(region_name, static)
        frames.append(df_region)

    data_all = pd.concat(frames, ignore_index=True)
    out_csv  = RAW_DIR / "raw_data_with_flood_status.csv"
    data_all.to_csv(out_csv, index=False)
    print(f"✅ Saved simulated data with Flood_Status → {out_csv}")

if __name__ == "__main__":
    main()
