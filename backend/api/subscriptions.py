from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.subscription import SubscriptionCreate, SubscriptionResponse
from backend.db_models.subscription import Subscription
from backend.db_models.user import User
from backend.core.deps import get_current_user

router = APIRouter()

@router.get("/user/subscriptions", response_model=list[SubscriptionResponse])
def list_subscriptions(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Subscription).filter(Subscription.user_id == user.id).all()

@router.post("/user/subscriptions", response_model=SubscriptionResponse)
def create_subscription(
    sub: SubscriptionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    exists = db.query(Subscription).filter_by(user_id=user.id, region=sub.region).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already subscribed")
    new_sub = Subscription(user_id=user.id, region=sub.region)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub

@router.delete("/user/subscriptions/{subscription_id}")
def delete_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    sub = db.query(Subscription).filter_by(id=subscription_id, user_id=user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(sub)
    db.commit()
    return {"detail": "Deleted"}
