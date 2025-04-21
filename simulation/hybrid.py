import os
import requests
import numpy as np
import pandas as pd
from config.regions_config import REGIONS

def run_forecast_pipeline(df_fc_raw, cal_pipe, sim, best_thr):
    fuzzy_scores = []
    for p, r in zip(df_fc_raw['Precipitation_norm'], df_fc_raw['River_Level_norm']):
        sim.input['precip'] = p
        sim.input['runoff'] = r
        sim.compute()
        fuzzy_scores.append(sim.output['risk'])

    df_fc_raw['Fuzzy_Risk'] = fuzzy_scores

    X_fc = df_fc_raw.drop(columns=['Date', 'Region'])
    prob_hybrid = cal_pipe.predict_proba(X_fc)[:, 1]
    alerts = (prob_hybrid >= best_thr).astype(int)

    return pd.DataFrame({
        'prob_hybrid': prob_hybrid,
        'alert': alerts
    }, index=df_fc_raw.index)
