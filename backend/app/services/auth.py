# app/services/auth.py
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os

SECRET_KEY = os.getenv("SECRET_KEY", "zmien-to-na-tajny-klucz-w-produkcji-min-32-znaki!")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dni

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token nieprawidłowy lub wygasł",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_payload(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Dependency do użycia w chronionych endpointach.
    Użycie: current_user: dict = Depends(get_current_user_payload)
    Dostępne klucze: current_user["id"], current_user["username"], current_user["role"]
    """
    payload = decode_token(token)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy token – brak ID użytkownika",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload