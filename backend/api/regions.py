from fastapi import APIRouter
from config.regions_config import REGIONS

router = APIRouter()

@router.get("/regions")
def list_regions():
    try:
        return [
            {
                "id": region,
                "name": region.capitalize(),
                "lat": info["lat"],
                "lon": info["lon"]
            }
            for region, info in REGIONS.items()
        ]
    except Exception as e:
        print("❌ REGIONS Error:", e)
        raise e
