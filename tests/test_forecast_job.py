import os
from simulation.forecast_job import fetch_forecast
from dotenv import load_dotenv

def test_fetch_forecast_output():
    load_dotenv()
    api_key = os.getenv("OWM_API_KEY")
    df, failed = fetch_forecast(api_key, days=1)
    assert not df.empty
    assert isinstance(failed, list)
    assert "Precipitation" in df.columns
    assert "Region" in df.columns
