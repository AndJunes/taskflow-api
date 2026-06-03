from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.scalars(select(models.User)).all()

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_users(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.UserOut, status_code=201)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.User(**data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user