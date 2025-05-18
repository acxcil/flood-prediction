```markdown
# ML-Driven Flood Prediction and Early Warning Dashboard

A full-stack flood risk forecasting system for Kyrgyzstan, combining hybrid fuzzy logic & LightGBM machine learning with a clean, modern React frontend dashboard.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)  
- [Architecture](#architecture)  
- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Getting Started](#getting-started)  
  - [Backend Setup](#backend-setup)  
  - [Simulation (Forecast Job)](#simulation-forecast-job)  
  - [Frontend Setup](#frontend-setup)  
- [Usage](#usage)  
  - [Running the API Server](#running-the-api-server)  
  - [Running the Frontend](#running-the-frontend)  
  - [Manual Forecast Job](#manual-forecast-job)  
- [API Reference](#api-reference)  
- [Directory Structure](#directory-structure)  
- [Clearing / Resetting the Database](#clearing--resetting-the-database)  
- [Contributing](#contributing)  
- [License](#license)  

---

## 📝 Project Overview

This system forecasts regional flood risk in Kyrgyzstan by:

1. Fetching daily weather data from OpenWeatherMap  
2. Computing 12 hydrometeorological features + fuzzy logic  
3. Passing through a calibrated LightGBM classifier  
4. Storing risk scores & alert levels (`Low` / `Moderate` / `High`) in PostgreSQL  
5. Exposing a FastAPI backend and a React/Next.js frontend dashboard  

---

## 🏗️ Architecture

```

┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│ OpenWeather  ├─────▶│ simulation/     ├─────▶│ backend/     │
│ API          │      │ forecast\_job.py │      │ FastAPI      │
└──────────────┘      └─────────────────┘      └─────┬────────┘
│
▼
PostgreSQL
│
▼
┌─────────────────┐
│ frontend/       │
│ Next.js +       │
│ Tailwind CSS    │
└─────────────────┘

````

---

## ⭐ Features

- **Regional Forecasts**: Latest & historical flood risk for 43+ regions  
- **Hybrid Fuzzy + ML Pipeline**: 12 features → fuzzy logic → LightGBM → calibrated threshold  
- **User Alerts**: Email subscription per region (JWT-secured)  
- **Admin Tools**: Trigger ingest/forecast, cleanup old data  
- **Dark/Light Mode** with Tailwind CSS theming  
- **Interactive Charts**: Risk distribution, historical trends, high-risk map  

---

## 🔧 Prerequisites

- **Python 3.9+**  
- **Node.js 16+ & npm**  
- **PostgreSQL 13+**  
- (Optional) Windows Task Scheduler or cron for daily automation  

---

## 🚀 Getting Started

### Backend Setup

1. **Clone & enter project root**  
   ```bash
   git clone https://github.com/acxcil/flood-prediction.git
   cd flood-prediction
````

2. **Create & activate a virtualenv**

   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS / Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Copy `.env.example` → `.env` and fill in:

   ```ini
   DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/flood_prediction_db
   OWM_API_KEY=<your_openweathermap_api_key>
   JWT_SECRET=<some_random_secret>
   ```

5. **Initialize database**

   ```bash
   # Create the DB and run migrations (if any)
   psql -U <user> -c "CREATE DATABASE flood_prediction_db;"
   # Or use your preferred GUI/migrations
   ```

---

### Simulation (Forecast Job)

The `simulation/forecast_job.py` script:

* **Fetches** new weather forecasts for any missing dates
* **Runs** the hybrid fuzzy+ML pipeline
* **Uploads** results to `POST /forecast/upload`

To catch up on missed days:

```bash
cd ../simulation
python forecast_job.py --backfill-days 14
```

---

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

2. **(Optional) Add Tailwind-watch**
   Tailwind is already configured; no further steps needed.

---

## 🏃 Usage

### Running the API Server

From `backend/`:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Running the Frontend

From `frontend/`:

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Manual Forecast Job

```bash
cd simulation
python forecast_job.py           # only fetches missing dates
python forecast_job.py --backfill-days 7
```

---

## 📚 API Reference

### Public

* `GET /regions`
* `GET /forecast/latest`
* `GET /forecast/{region}?days=N`
* `GET /forecast/{region}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

### Auth

* `POST /users/` → register `{ email, password }`
* `POST /auth/login` → form-urlencoded `username` & `password`
* `GET /auth/me` → profile (requires `Authorization: Bearer <token>`)

### Subscriptions (JWT required)

* `GET /user/subscriptions`
* `POST /user/subscriptions` `{ region }`
* `DELETE /user/subscriptions/{id}`

### Admin (JWT, `is_admin` only)

* `POST /admin/ingest`
* `DELETE /admin/cleanup?days=N`
* `GET /admin/ping`

---

## 📂 Directory Structure

```
flood-prediction/
├── backend/
│   ├── main.py
│   ├── models/
│   ├── api/…
│   └── requirements.txt
├── simulation/
│   └── forecast_job.py
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── tailwind.config.js
│   └── package.json
├── .env
└── README.md
```

---

## 🧹 Clearing / Resetting the Database

To remove all users & subscriptions (via psql CLI):

```sql
-- First drop subscriptions (or use CASCADE)
DELETE FROM subscriptions;
DELETE FROM users;
```

Or:

```sql
TRUNCATE TABLE subscriptions, users RESTART IDENTITY CASCADE;
```

---

## 🤝 Contributing

1. Fork & clone
2. Create a feature branch
3. Submit PR & ensure CI passes

---

## 📄 License

This project is licensed under the MIT License.

```
```
