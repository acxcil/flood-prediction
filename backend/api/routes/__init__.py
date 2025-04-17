from fastapi import APIRouter
from api.routes import prediction, data, regions, alerts, auth

api_router = APIRouter()
api_router.include_router(prediction.router)
api_router.include_router(data.router)
api_router.include_router(regions.router)
api_router.include_router(alerts.router)
api_router.include_router(auth.router)