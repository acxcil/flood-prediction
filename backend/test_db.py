# test_db.py
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://myuser:mypassword@localhost:5432/flood_prediction_db"
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        print("✅ Connection successful!")
except Exception as e:
    print("❌ Connection failed:", e)
