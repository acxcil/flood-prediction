# Flood Prediction & Early-Warning System

A machine-learning–driven pipeline for near-real-time flood forecasting in mountainous basins, tailored to Kyrgyzstan’s data streams and operational constraints. This repository implements end-to-end components—from automated data ingestion through feature engineering, fuzzy-logic risk indexing, hybrid ensemble modeling, to a REST API and scheduled jobs—packaged in Docker for consistent deployment. **All input time series in this demo are generated or simulated**, enabling offline experimentation with the full pipeline.

---

## 🚀 Features

- **Automated Ingestion & Preprocessing**  
  – Pulls (or simulates) hourly rainfall and river-stage data, resamples to 3 h steps, fills short gaps, detects outliers.  
- **Synthetic Data Simulation**  
  – `simulation/` contains scripts & sample configs to generate realistic hydrometeorological datasets for demo and testing.  
- **Feature Engineering**  
  – Computes rolling sums, NDVI, terrain metrics (slope, distance to stream), seasonal encodings, land-cover one-hots.  
- **Fuzzy Risk Index**  
  – Mamdani fuzzy logic combines precipitation, stage, and NDVI into a continuous `fuzzy_risk` feature.  
- **Hybrid Ensemble Model**  
  – Stacked RandomForest + LightGBM with Ridge meta-learner, calibrated for well-behaved flood-probabilities.  
- **Model Explainability**  
  – SHAP values identify top drivers of flood risk (e.g. monsoon seasonality, fuzzy index).  
- **REST API**  
  – `POST /predict` returns per-station flood-risk probabilities for a given timestamp.  
- **Job Scheduler**  
  – APScheduler “cron” jobs to re-ingest data daily and re-forecast every 3 h.  
- **Containerized Deployment**  
  – Dockerfile + Uvicorn+Gunicorn for reproducible environments.  

---

## 📂 Repository Layout

```
.
├── backend/                # API layer, FastAPI application    
├── config/                 # configuration templates (e.g. config.yaml)  
├── data/                   # raw & processed sample data (not checked in)  
├── notebooks/              # EDA & prototyping  
├── preprocessing/          # ingestion & feature-engineering scripts  
├── scripts/                # utility scripts  
├── simulation/             # synthetic data generators & configs  
├── training/               # model training & hyperparameter search  
├── tests/                  # pytest suites for ingestion, API, forecasting  
├── run_tests.py            # wrapper to invoke all test suites  
├── requirements.txt        # Python dependencies  
└── Dockerfile              # container build instructions  
```

---

## ⚙️ Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/acxcil/flood-prediction.git
   cd flood-prediction
   ```

2. **Create & activate a virtual environment**  
   ```bash
   python3 -m venv venv
   source venv/bin/activate     # macOS/Linux
   venv\Scripts\activate.bat    # Windows
   ```

3. **Install dependencies**  
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Copy & customize configuration**  
   ```bash
   cp config/config.sample.yaml config/config.yaml
   ```
   Populate `config.yaml` with your API keys, database URI, forecast grid, scheduler timings, or simulation parameters.

---

## 💻 Usage

### 1. (Optional) Generate Synthetic Data
```bash
python simulation/generate_data.py --config config/config.yaml
```
This populates `data/raw/` with simulated rain/stage time-series for testing.

### 2. Data Ingestion & Feature Engineering
```bash
python preprocessing/preprocess.py --config config/config.yaml
```

### 3. Train or Update Model
```bash
python training/hybrid_model.py --config config/config.yaml
```

### 4. Run Scheduled Jobs (Blocking)
```bash
python scripts/forecast_job.py --config config/config.yaml
```

### 5. Start the Prediction API
```bash
uvicorn backend.api:app --host 0.0.0.0 --port 8000
# or via Gunicorn for production:
gunicorn backend.api:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:80
```

### 6. Query the API
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"station_id": 123, "timestamp": "2025-07-15T06:00:00Z"}'
```

Response:
```json
{
  "station_id": 123,
  "risk": 0.78
}
```

---

## ✅ Testing

Run the full test suite with:
```bash
pytest --maxfail=1 -q
# or via:
python run_tests.py
```

Tests cover data ingestion, feature engineering sanity checks, fuzzy‐logic outputs, model inference, and API endpoint correctness.

---

## 🐳 Docker Deployment

Build the image:
```bash
docker build -t flood-predictor:latest .
```

Run the container:
```bash
docker run -e CONFIG_PATH=/app/config/config.yaml \
           -p 8000:80 \
           flood-predictor:latest
```
