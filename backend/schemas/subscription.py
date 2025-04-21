from pydantic import BaseModel

class SubscriptionCreate(BaseModel):
    region: str

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    region: str

    class Config:
        from_attributes = True
