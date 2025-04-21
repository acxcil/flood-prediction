# Auto‑geocode region coordinates and write out full config

import time
import json
from geopy.geocoders import Nominatim
from pathlib import Path

# 1) Load your existing config (without lat/lon)
from config.regions_config import REGIONS

# 2) Initialize Nominatim geocoder
geolocator = Nominatim(user_agent="flood_pred_config")

# 3) For each region, query “<region>, Kyrgyzstan”
augmented = {}
for region, info in REGIONS.items():
    query = f"{region}, Kyrgyzstan"
    try:
        loc = geolocator.geocode(query, exactly_one=True, timeout=10)
        lat, lon = loc.latitude, loc.longitude
    except Exception:
        lat = lon = None
    # copy original info + new lat/lon
    augmented[region] = {**info, "lat": lat, "lon": lon}
    print(f"{region:12s} →  {lat}, {lon}")
    time.sleep(1)  # be kind to the geocoding service

# 4) Write out a new Python config file
out_path = Path("config/regions_config_full.py")
with open(out_path, "w", encoding="utf8") as f:
    f.write('"""\nAuto-generated full regions_config with lat/lon\n"""\n\n')
    f.write("REGIONS = ")
    json.dump(augmented, f, indent=4)
print(f"\n✅ Wrote full config to {out_path}")
