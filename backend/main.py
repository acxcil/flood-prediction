from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.database import Base, engine


# Import all DB models so SQLAlchemy sees them
from backend.db_models.user import User
from backend.db_models.subscription import Subscription
from backend.db_models.forecast import Forecast

# Import API routers
from backend.api import auth, subscriptions, forecast, predict

from backend.api import auth, subscriptions, forecast, predict
from backend.api import charts, regions, admin, simulated



# Initialize database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Flood Prediction System",
    description="Backend API for ML-based flood prediction and early warning system",
    version="1.0.0"
)


# Allow frontend (adjust port/domain for deployed version)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API route modules
app.include_router(auth.router)
app.include_router(subscriptions.router)
app.include_router(predict.router)
app.include_router(forecast.router)

app.include_router(auth.router)
app.include_router(subscriptions.router)
app.include_router(predict.router)
app.include_router(forecast.router)
app.include_router(charts.router)
app.include_router(regions.router)
app.include_router(admin.router)
app.include_router(simulated.router)



