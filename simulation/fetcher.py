import os
import requests
import numpy as np
import pandas as pd
from config.regions_config import REGIONS

def fetch_forecast(api_key, days=3):
    cutoff = pd.Timestamp.now(tz='UTC') + pd.Timedelta(days=days)
    static_map = {
        'Elevation_m': 'elevation_m',
        'Slope_deg': 'slope_deg',
        'Drainage_Density': 'drainage_density',
        'Dist_to_River_km': 'dist_to_river_km',
        'Soil_Type': 'soil_type',
        'Land_Cover': 'land_cover',
        'TWI': 'TWI',
        'NDVI': 'NDVI'
    }

    all_forecasts = []
    failed_regions = []

    for i, (region, info) in enumerate(REGIONS.items(), start=1):
        print(f"[{i}/{len(REGIONS)}] Fetching forecast for {region}...", end="", flush=True)
        lat, lon = info.get('lat'), info.get('lon')

        if lat is None or lon is None:
            print(" SKIPPED: Missing lat/lon")
            failed_regions.append(region)
            continue

        url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}"
            f"&appid={api_key}&units=metric"
        )

        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
        except Exception as e:
            print(f" FAILED: {e}")
            failed_regions.append(region)
            continue
        else:
            print(" OK")

        data = resp.json()
        if 'list' not in data:
            print("  → unexpected response format, skipping")
            failed_regions.append(region)
            continue

        df3h = pd.DataFrame(data['list'])
        df3h['Date'] = pd.to_datetime(df3h['dt'], unit='s', utc=True)
        df3h = df3h[df3h['Date'] < cutoff]

        if 'rain' in df3h.columns:
            df3h['rain'] = df3h['rain'].apply(lambda v: v.get('3h', 0) if isinstance(v, dict) else 0)
        else:
            df3h = df3h.assign(rain=0)

        daily = (
            df3h.set_index('Date')
            .resample('D')['rain']
            .sum()
            .rename('Precipitation')
            .reset_index()
        )
        daily['Region'] = region

        for dfcol, infokey in static_map.items():
            daily[dfcol] = info[infokey]

        m = daily['Date'].dt.month
        daily['month_sin'] = np.sin(2 * np.pi * m / 12)
        daily['month_cos'] = np.cos(2 * np.pi * m / 12)

        maxp = daily['Precipitation'].max()
        daily['Precipitation_norm'] = daily['Precipitation'] / (maxp if maxp > 0 else 1)
        daily['River_Level_norm'] = daily['Precipitation_norm']

        all_forecasts.append(daily)

    # Save failures to file for review/retry
    if failed_regions:
        os.makedirs("data", exist_ok=True)
        with open("data/failed_regions.txt", "w") as f:
            for r in failed_regions:
                f.write(r + "\n")
        print(f"❌ Failed regions written to data/failed_regions.txt ({len(failed_regions)} failures)")

    # Return both the successful DataFrame and failed region list
    df_result = pd.concat(all_forecasts, ignore_index=True) if all_forecasts else pd.DataFrame()
    return df_result, failed_regions
