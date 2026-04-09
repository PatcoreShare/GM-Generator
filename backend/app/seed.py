from sqlalchemy.orm import Session

from app.models.db_models import UserDB
from app.services.auth import hash_password


def seed_users(db: Session):
    users = [
        {"username": "admin", "password": "qweasd", "role": "admin"},
        {"username": "asd", "password": "qweasd", "role": "user"},
        {"username": "asd1", "password": "qweasd", "role": "user"},
    ]

    for item in users:
        exists = db.query(UserDB).filter(UserDB.username == item["username"]).first()
        if not exists:
            user = UserDB(
                username=item["username"],
                password_hash=hash_password(item["password"]),
                role=item["role"],
            )
            db.add(user)

    db.commit()