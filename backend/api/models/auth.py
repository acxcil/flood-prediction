# api/models/auth.py

from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., description="Unique username")
    email: str = Field(..., description="User email")
    password: str = Field(..., description="Password")
    preferred_region: Optional[str] = Field(None, description="Region for alert subscription")

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "floodWatcher",
                "email": "user@example.com",
                "password": "strongpassword123",
                "preferred_region": "Batken"
            }
        }
    }

class UserLogin(BaseModel):
    username: str = Field(..., description="Username")
    password: str = Field(..., description="Password")

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "floodWatcher",
                "password": "strongpassword123"
            }
        }
    }

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
