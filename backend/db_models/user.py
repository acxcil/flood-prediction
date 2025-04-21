from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from backend.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)  # ✅ Add this line

    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    