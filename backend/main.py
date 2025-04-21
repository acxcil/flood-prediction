from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from backend.core.database import Base, engine

# Import DB models so SQLAlchemy sees them
from backend.db_models.user import User
from backend.db_models.subscription import Subscription
from backend.db_models.forecast import Forecast

# Import all routers
from backend.api import auth, subscriptions, forecast, predict
from backend.api import charts, regions, admin, simulated

# Create all tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Flood Prediction System",
    description="Backend API for ML-based flood prediction and early warning system",
    version="1.0.0"
)

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(subscriptions.router)
app.include_router(predict.router)
app.include_router(forecast.router)
app.include_router(charts.router)
app.include_router(regions.router)
app.include_router(admin.router)
app.include_router(simulated.router)

# ✅ Add security scheme for Swagger UI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"BearerAuth": []}])
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
