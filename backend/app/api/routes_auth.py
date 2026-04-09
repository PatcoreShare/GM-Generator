from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import UserDB
from app.models.schemas import LoginRequest, RegisterRequest, UserResponse
from app.services.auth import hash_password, verify_password

router = APIRouter()


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Błędny login lub hasło")

    return UserResponse(id=str(user.id), username=user.username, role=user.role)


@router.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Użytkownik już istnieje")

    user = UserDB(
        username=payload.username,
        password_hash=hash_password(payload.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(id=str(user.id), username=user.username, role=user.role)