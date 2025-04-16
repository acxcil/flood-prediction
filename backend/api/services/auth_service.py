# api/services/auth_service.py

from datetime import datetime, timedelta
from typing import Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt

# For demonstration, we'll use an in-memory storage
# In production, use a database (e.g., SQLite, PostgreSQL, etc.)
fake_user_db = {}

SECRET_KEY = "your_secret_key_here"   # Use a secure secret in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

class AuthService:
    def create_user(self, user_data) -> Dict[str, Any]:
        # Assume user_data is a Pydantic model (UserCreate)
        if user_data.username in fake_user_db:
            raise Exception("Username already exists")
        hashed_password = get_password_hash(user_data.password)
        user_record = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "preferred_region": user_data.preferred_region,
            "created_at": datetime.utcnow()
        }
        fake_user_db[user_data.username] = user_record
        return user_record

    def authenticate_user(self, user_data) -> Dict[str, str]:
        user_record = fake_user_db.get(user_data.username)
        if not user_record or not verify_password(user_data.password, user_record["hashed_password"]):
            raise Exception("Invalid credentials")
        access_token = self.create_access_token(data={"sub": user_data.username})
        return {"access_token": access_token, "token_type": "bearer"}

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

auth_service = AuthService()
