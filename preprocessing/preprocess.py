import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler

RAW_FILE   = "data/raw/raw_data_with_flood_status.csv"
CLEAN_DIR  = Path("data/cleaned")
CLEAN_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_CSV = CLEAN_DIR / "all_regions.csv"

def load_raw():
    return pd.read_csv(RAW_FILE, parse_dates=["Date"])

def inject_missing(df, frac=0.05):
    for col in ["Precipitation","River_Level","Lake_Level","Dam_Level"]:
        if col in df.columns:
            df.loc[df.sample(frac=frac, random_state=42).index, col] = np.nan
    return df

def impute_and_normalize(df):
    df.sort_values(["Region","Date"], inplace=True)
    df.fillna(method="ffill", inplace=True)
    df.fillna(method="bfill", inplace=True)

    # Don’t re-normalize anything already ending in "_norm"
    exclude = {"risk_score", "Flood_Status"}
    num_cols = [
        c for c in df.select_dtypes(include="number").columns
        if c not in exclude and not c.endswith("_norm")
    ]

    scaler = MinMaxScaler()
    df[[f"{c}_norm" for c in num_cols]] = scaler.fit_transform(df[num_cols])
    return df

def main():
    df = load_raw()
    df = inject_missing(df)
    df = impute_and_normalize(df)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"✅ Cleaned data → {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
