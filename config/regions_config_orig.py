# config/regions_config.py

"""
Configuration of all Kyrgyzstan simulation sites, with static terrain features.

Region list (54 total):
 - 2 cities of republican significance: Bishkek, Osh
 - 44 districts (Chüy 8 + Issyk‑Kul 5 + Naryn 5 + Talas 4 + Batken 3 + Jalal‑Abad 9 + Osh 7)
Each entry includes:
 - elevation_m      : mean elevation in meters
 - slope_deg        : average terrain slope in degrees
 - drainage_density : channel length per km²
 - dist_to_river_km : nearest major river distance
 - soil_type        : categorical soil class
 - land_cover       : dominant land‑use / land‑cover
 - TWI              : topographic wetness index
 - NDVI             : mean NDVI (vegetation index)
 - has_lake,has_dam : booleans for nearby lake/reservoir
"""

REGIONS = {
    # === Cities of republican significance ===
    "Bishkek": {
        "elevation_m": 800, "slope_deg": 3.5,  "drainage_density": 2.2,
        "dist_to_river_km": 1.2, "soil_type": "loam",      "land_cover": "urban",
        "TWI": 12.3,       "NDVI": 0.45,      "has_lake": False, "has_dam": False
    },
    "Osh": {
        "elevation_m": 1000,"slope_deg": 8.0,  "drainage_density": 2.5,
        "dist_to_river_km": 0.7, "soil_type": "sandy_loam", "land_cover": "urban",
        "TWI": 13.8,       "NDVI": 0.38,      "has_lake": False, "has_dam": False
    },

    # === Chüy Region (8 districts + Tokmok city) ===
    "Tokmok": {
        "elevation_m": 900, "slope_deg": 4.0,  "drainage_density": 2.0,
        "dist_to_river_km": 0.5, "soil_type": "sandy_loam", "land_cover": "agriculture",
        "TWI": 11.5,       "NDVI": 0.52,      "has_lake": False, "has_dam": False
    },
    "Alamudün": {  # Lebedinovka
        "elevation_m": 950, "slope_deg": 5.0, "drainage_density": 1.9,
        "dist_to_river_km": 0.3, "soil_type": "clay_loam", "land_cover": "agriculture",
        "TWI": 12.8,       "NDVI": 0.49,      "has_lake": False, "has_dam": False
    },
    "Chüy": {      # also covers Tokmok environs
        "elevation_m": 880, "slope_deg": 3.8, "drainage_density": 2.1,
        "dist_to_river_km": 0.2, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 11.9,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },
    "Jayil": {     # Kara‑Balta
        "elevation_m": 920, "slope_deg": 4.5, "drainage_density": 1.8,
        "dist_to_river_km": 0.4, "soil_type": "loam",      "land_cover": "urban_agri",
        "TWI": 12.1,       "NDVI": 0.47,      "has_lake": False, "has_dam": False
    },
    "Kemin": {
        "elevation_m": 1000,"slope_deg": 6.0, "drainage_density": 1.7,
        "dist_to_river_km": 0.5, "soil_type": "silt_loam",  "land_cover": "forest",
        "TWI": 13.5,       "NDVI": 0.55,      "has_lake": False, "has_dam": False
    },
    "Moskva": {    # Belovodskoye
        "elevation_m": 1050,"slope_deg": 5.2, "drainage_density": 1.6,
        "dist_to_river_km": 0.6, "soil_type": "clay_loam", "land_cover": "agriculture",
        "TWI": 14.0,       "NDVI": 0.48,      "has_lake": False, "has_dam": False
    },
    "Panfilov": {  # Kayyngdy
        "elevation_m": 970, "slope_deg": 4.8, "drainage_density": 1.9,
        "dist_to_river_km": 0.3, "soil_type": "sandy_loam", "land_cover": "agriculture",
        "TWI": 12.4,       "NDVI": 0.51,      "has_lake": False, "has_dam": False
    },
    "Sokuluk": {
        "elevation_m": 840, "slope_deg": 3.2, "drainage_density": 2.3,
        "dist_to_river_km": 0.4, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 11.7,       "NDVI": 0.53,      "has_lake": False, "has_dam": False
    },
    "Ysyk-Ata": {  # Kant
        "elevation_m": 850, "slope_deg": 3.5, "drainage_density": 2.2,
        "dist_to_river_km": 0.6, "soil_type": "silt_loam",  "land_cover": "urban_agri",
        "TWI": 12.2,       "NDVI": 0.49,      "has_lake": False, "has_dam": False
    },

    # === Issyk‑Kul Region (5 districts) ===
    "Ak-Suu": {     # Teploklyuchenka
        "elevation_m": 1600,"slope_deg": 8.0, "drainage_density": 1.4,
        "dist_to_river_km": 0.7, "soil_type": "sandy_loam", "land_cover": "mountain_forest",
        "TWI": 15.2,       "NDVI": 0.60,      "has_lake": False, "has_dam": False
    },
    "Issyk-Kul": {  # Cholpon‑Ata
        "elevation_m": 1608,"slope_deg": 2.5, "drainage_density": 1.2,
        "dist_to_river_km": 1.5, "soil_type": "silt_loam",  "land_cover": "lakeshore",
        "TWI": 14.8,       "NDVI": 0.40,      "has_lake": True,  "has_dam": False
    },
    "Jeti-Ögüz": {  # Kyzyl-Suu
        "elevation_m": 2000,"slope_deg": 12.0,"drainage_density": 1.3,
        "dist_to_river_km": 0.5, "soil_type": "clay",      "land_cover": "mountain_meadow",
        "TWI": 16.0,       "NDVI": 0.55,      "has_lake": False, "has_dam": False
    },
    "Tong": {       # Bökönbaev
        "elevation_m": 1750,"slope_deg": 7.5, "drainage_density": 1.5,
        "dist_to_river_km": 0.8, "soil_type": "sandy_loam", "land_cover": "agriculture",
        "TWI": 14.5,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },
    "Tüp": {
        "elevation_m": 1650,"slope_deg": 3.0, "drainage_density": 1.1,
        "dist_to_river_km": 1.2, "soil_type": "silt_loam",  "land_cover": "lakeshore",
        "TWI": 13.9,       "NDVI": 0.42,      "has_lake": True,  "has_dam": False
    },

    # === Naryn Region (5 districts) ===
    "Ak-Talaa": {   # Baetov
        "elevation_m": 2200,"slope_deg": 14.0,"drainage_density": 1.6,
        "dist_to_river_km": 0.4, "soil_type": "clay",      "land_cover": "alpine_meadow",
        "TWI": 17.0,       "NDVI": 0.35,      "has_lake": False, "has_dam": False
    },
    "At-Bashy": {
        "elevation_m": 2300,"slope_deg": 15.0,"drainage_density": 1.8,
        "dist_to_river_km": 0.3, "soil_type": "silt_loam",  "land_cover": "alpine_meadow",
        "TWI": 17.5,       "NDVI": 0.32,      "has_lake": False, "has_dam": False
    },
    "Jumgal": {     # Chaek
        "elevation_m": 2100,"slope_deg": 10.0,"drainage_density": 1.7,
        "dist_to_river_km": 0.6, "soil_type": "clay_loam", "land_cover": "forest",
        "TWI": 16.8,       "NDVI": 0.40,      "has_lake": False, "has_dam": False
    },
    "Kochkor": {
        "elevation_m": 1900,"slope_deg": 9.0, "drainage_density": 1.5,
        "dist_to_river_km": 0.2, "soil_type": "loam",      "land_cover": "grassland",
        "TWI": 15.8,       "NDVI": 0.38,      "has_lake": True,  "has_dam": False
    },
    "Naryn": {
        "elevation_m": 2000,"slope_deg": 12.0,"drainage_density": 1.9,
        "dist_to_river_km": 0.3, "soil_type": "clay",      "land_cover": "urban",
        "TWI": 16.2,       "NDVI": 0.45,      "has_lake": False, "has_dam": False
    },

    # === Talas Region (4 districts) ===
    "Bakay-Ata": {
        "elevation_m": 1050,"slope_deg": 6.0, "drainage_density": 1.8,
        "dist_to_river_km": 0.5, "soil_type": "silt_loam",  "land_cover": "agriculture",
        "TWI": 13.0,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },
    "Kara-Buura": {
        "elevation_m": 1150,"slope_deg": 7.5, "drainage_density": 1.6,
        "dist_to_river_km": 0.6, "soil_type": "loam",      "land_cover": "forest",
        "TWI": 14.2,       "NDVI": 0.48,      "has_lake": False, "has_dam": False
    },
    "Manas": {
        "elevation_m": 1100,"slope_deg": 5.5, "drainage_density": 1.7,
        "dist_to_river_km": 0.4, "soil_type": "clay_loam", "land_cover": "agriculture",
        "TWI": 13.5,       "NDVI": 0.52,      "has_lake": False, "has_dam": False
    },
    "Talas": {
        "elevation_m": 1000,"slope_deg": 6.5, "drainage_density": 1.9,
        "dist_to_river_km": 0.3, "soil_type": "silt_loam",  "land_cover": "urban_agri",
        "TWI": 13.8,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },

    # === Batken Region (3 districts) ===
    "Batken": {
        "elevation_m": 900, "slope_deg": 10.0,"drainage_density": 1.5,
        "dist_to_river_km": 0.7, "soil_type": "sandy_loam", "land_cover": "agriculture",
        "TWI": 12.7,       "NDVI": 0.44,      "has_lake": False, "has_dam": False
    },
    "Kadamjay": {
        "elevation_m": 980, "slope_deg": 12.0,"drainage_density": 1.4,
        "dist_to_river_km": 0.8, "soil_type": "clay_loam", "land_cover": "mining_forest",
        "TWI": 13.2,       "NDVI": 0.40,      "has_lake": False, "has_dam": True
    },
    "Isfana": {
        "elevation_m": 1200,"slope_deg": 14.0,"drainage_density": 1.6,
        "dist_to_river_km": 0.5, "soil_type": "loam",      "land_cover": "forest",
        "TWI": 14.0,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },

    # === Jalal‑Abad Region (9 districts) ===
    "Aksy": {      # Kerben
        "elevation_m": 1100,"slope_deg": 15.0,"drainage_density": 1.7,
        "dist_to_river_km": 0.4, "soil_type": "clay",      "land_cover": "agriculture",
        "TWI": 14.5,       "NDVI": 0.48,      "has_lake": False, "has_dam": False
    },
    "Ala-Buka": {
        "elevation_m": 1050,"slope_deg": 10.0,"drainage_density": 1.8,
        "dist_to_river_km": 0.6, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 13.9,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },
    "Bazar-Korgon": {
        "elevation_m": 950, "slope_deg": 8.0, "drainage_density": 1.9,
        "dist_to_river_km": 0.3, "soil_type": "silt_loam",  "land_cover": "urban_agri",
        "TWI": 13.2,       "NDVI": 0.47,      "has_lake": False, "has_dam": False
    },
    "Chatkal": {
        "elevation_m": 1400,"slope_deg": 18.0,"drainage_density": 1.5,
        "dist_to_river_km": 0.7, "soil_type": "clay_loam", "land_cover": "mountain_forest",
        "TWI": 15.8,       "NDVI": 0.56,      "has_lake": False, "has_dam": False
    },
    "Jalal-Abad": {
        "elevation_m": 950, "slope_deg": 9.0, "drainage_density": 1.8,
        "dist_to_river_km": 0.5, "soil_type": "loam",      "land_cover": "urban",
        "TWI": 13.7,       "NDVI": 0.46,      "has_lake": False, "has_dam": False
    },
    "Kanysh-Kyya": {
        "elevation_m": 1300,"slope_deg": 12.0,"drainage_density": 1.6,
        "dist_to_river_km": 0.6, "soil_type": "sandy_loam", "land_cover": "forest",
        "TWI": 14.3,       "NDVI": 0.51,      "has_lake": False, "has_dam": False
    },
    "Masy": {
        "elevation_m": 900, "slope_deg": 8.5, "drainage_density": 1.9,
        "dist_to_river_km": 0.4, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 13.5,       "NDVI": 0.49,      "has_lake": False, "has_dam": True
    },
    "Suzak": {
        "elevation_m": 920, "slope_deg": 7.5, "drainage_density": 1.7,
        "dist_to_river_km": 0.3, "soil_type": "silt_loam",  "land_cover": "agriculture",
        "TWI": 13.4,       "NDVI": 0.48,      "has_lake": False, "has_dam": True
    },
    "Toktogul": {
        "elevation_m": 1000,"slope_deg": 11.0,"drainage_density": 1.5,
        "dist_to_river_km": 0.2, "soil_type": "clay",      "land_cover": "reservoir",
        "TWI": 14.9,       "NDVI": 0.30,      "has_lake": False, "has_dam": True
    },

    # === Osh Region (7 districts + Özgön) ===
    "Aravan": {
        "elevation_m": 950, "slope_deg": 9.0, "drainage_density": 2.0,
        "dist_to_river_km": 0.5, "soil_type": "sandy_loam", "land_cover": "urban_agri",
        "TWI": 13.8,       "NDVI": 0.44,      "has_lake": False, "has_dam": False
    },
    "Daroot-Korgon": {
        "elevation_m": 2800,"slope_deg": 18.0,"drainage_density": 1.3,
        "dist_to_river_km": 0.6, "soil_type": "clay_loam", "land_cover": "mountain_meadow",
        "TWI": 16.5,       "NDVI": 0.35,      "has_lake": False, "has_dam": False
    },
    "Gülchö": {
        "elevation_m": 1450,"slope_deg": 14.0,"drainage_density": 1.7,
        "dist_to_river_km": 0.4, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 14.2,       "NDVI": 0.47,      "has_lake": False, "has_dam": False
    },
    "Kara-Kulja": {
        "elevation_m": 1300,"slope_deg": 12.0,"drainage_density": 1.8,
        "dist_to_river_km": 0.5, "soil_type": "silt_loam",  "land_cover": "forest",
        "TWI": 14.6,       "NDVI": 0.50,      "has_lake": False, "has_dam": False
    },
    "Kara-Suu": {
        "elevation_m": 1000,"slope_deg": 9.0, "drainage_density": 2.1,
        "dist_to_river_km": 0.3, "soil_type": "sandy_loam", "land_cover": "urban_agri",
        "TWI": 13.3,       "NDVI": 0.45,      "has_lake": False, "has_dam": False
    },
    "Nookat": {
        "elevation_m": 1000,"slope_deg": 8.0, "drainage_density": 2.0,
        "dist_to_river_km": 0.5, "soil_type": "loam",      "land_cover": "agriculture",
        "TWI": 13.7,       "NDVI": 0.48,      "has_lake": False, "has_dam": False
    },
    "Özgön": {
        "elevation_m": 890, "slope_deg": 7.0, "drainage_density": 2.2,
        "dist_to_river_km": 0.4, "soil_type": "silt_loam",  "land_cover": "urban_agri",
        "TWI": 13.5,       "NDVI": 0.46,      "has_lake": False, "has_dam": False
    }
}
