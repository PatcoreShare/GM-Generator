# backend/app/api/routes_auth.py
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import EmailVerificationTokenDB, UserDB
from app.models.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserAdminResponse,
    UserResponse,
)
from app.services.auth import (
    create_access_token,
    get_current_user_payload,
    hash_password,
    verify_password,
)
from app.services.email_service import send_verification_email

router = APIRouter()


# ── Logowanie ────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == payload.username).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Błędny login lub hasło")

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Konto nieaktywne. Sprawdź skrzynkę e-mail i kliknij link aktywacyjny.",
        )

    access_token = create_access_token(
        data={"sub": user.username, "id": str(user.id), "role": user.role}
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=str(user.id), username=user.username, role=user.role),
    )


# ── Rejestracja ──────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if len(payload.username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Nazwa użytkownika musi mieć min. 3 znaki")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Hasło musi mieć min. 6 znaków")
    if not payload.email or "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Podaj prawidłowy adres e-mail")

    if db.query(UserDB).filter(UserDB.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Użytkownik o tej nazwie już istnieje")
    if db.query(UserDB).filter(UserDB.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Ten adres e-mail jest już zajęty")

    user = UserDB(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="user",
        is_active=False,
    )
    db.add(user)
    db.flush()

    token = str(uuid.uuid4())
    verification = EmailVerificationTokenDB(
        user_id=user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(verification)
    db.commit()
    db.refresh(user)

    try:
        send_verification_email(user.email, user.username, token)
    except RuntimeError:
        pass  # Nie blokuj rejestracji jeśli e-mail nie doszedł

    return UserResponse(id=str(user.id), username=user.username, role=user.role)


# ── Weryfikacja e-mail ────────────────────────────────────────────────────────

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    record = (
        db.query(EmailVerificationTokenDB)
        .filter(EmailVerificationTokenDB.token == token)
        .first()
    )

    if not record:
        raise HTTPException(status_code=400, detail="Nieprawidłowy lub już użyty link aktywacyjny")

    if record.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        db.delete(record)
        db.commit()
        raise HTTPException(status_code=400, detail="Link aktywacyjny wygasł. Zarejestruj się ponownie.")

    user = db.query(UserDB).filter(UserDB.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")

    user.is_active = True
    db.delete(record)
    db.commit()

    return {"message": f"Konto '{user.username}' zostało aktywowane. Możesz się teraz zalogować."}


# ── Profil zalogowanego ───────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user_payload), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == current_user["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")
    return UserResponse(id=str(user.id), username=user.username, role=user.role)


# ── Endpointy tylko dla admina ────────────────────────────────────────────────

def require_admin(current_user: dict = Depends(get_current_user_payload)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Brak uprawnień administratora")
    return current_user


@router.get("/admin/users", response_model=list[UserAdminResponse])
def list_users(db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    users = db.query(UserDB).order_by(UserDB.created_at.desc()).all()
    return [
        UserAdminResponse(
            id=str(u.id),
            username=u.username,
            email=u.email or "",
            role=u.role,
            is_active=u.is_active,
            created_at=str(u.created_at),
        )
        for u in users
    ]


@router.patch("/admin/users/{user_id}/activate")
def activate_user(user_id: str, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")
    user.is_active = True
    db.commit()
    return {"message": f"Konto '{user.username}' zostało aktywowane"}


@router.patch("/admin/users/{user_id}/deactivate")
def deactivate_user(user_id: str, db: Session = Depends(get_db), _: dict = Depends(require_admin)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")
    user.is_active = False
    db.commit()
    return {"message": f"Konto '{user.username}' zostało zablokowane"}
