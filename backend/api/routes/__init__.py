from fastapi import APIRouter
from api.routes import prediction, data, regions

api_router = APIRouter()
api_router.include_router(prediction.router)
api_router.include_router(data.router)
api_router.include_router(regions.router)