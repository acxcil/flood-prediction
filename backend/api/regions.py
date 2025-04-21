from fastapi import APIRouter
from config.regions_config import REGIONS


router = APIRouter()

@router.get("/regions")
def list_regions():
    return [
        {"id": r["id"], "name": r["name"], "lat": r["lat"], "lon": r["lon"]}
        for r in REGIONS
    ]
