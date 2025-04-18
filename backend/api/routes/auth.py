from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging

from api.models.auth import UserCreate, UserLogin, Token
from api.services.auth_service import auth_service

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/signup", response_model=Dict[str, Any], status_code=201)
async def signup(user: UserCreate):
    """
    Register a new user. This endpoint is optional; all public pages remain accessible without login.
    Users who sign up can later receive location-based alerts.
    """
    try:
        new_user = auth_service.create_user(user)
        return {"message": "User registered successfully", "user": new_user}
    except Exception as e:
        logger.error(f"Signup failed: {e}")
        raise HTTPException(status_code=500, detail="User registration failed")

@router.post("/login", response_model=Token, status_code=200)
async def login(user: UserLogin):
    """
    User login. Returns a JWT token on successful authentication.
    This is optional—users can view the dashboard without logging in,
    but logging in enables personalized features (such as receiving alerts).
    """
    try:
        token = auth_service.authenticate_user(user)
        return token
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
