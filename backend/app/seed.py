import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.db_models import GeneratorDB, UserDB
from app.services.auth import hash_password


BUILTIN_DIR = Path(__file__).resolve().parent / "data" / "builtin"


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


def _normalize_builtin_generator(raw: dict) -> dict:
    legacy_id = raw.get("legacyId") or raw.get("id")
    if not legacy_id:
        raise ValueError("Built-in generator must have 'id' or 'legacyId'")

    generator_type = raw.get("type", "table")

    normalized = {
        "legacy_id": legacy_id,
        "name": raw.get("name") or raw.get("title") or "Bez nazwy",
        "type": generator_type,
        "description": raw.get("description"),
        "owner_name": raw.get("ownerName", "System"),
        "is_built_in": raw.get("isBuiltIn", True),
        "tags": raw.get("tags", ["Wbudowane"]),
        "created_at": raw.get("createdAt"),
        "data": {},
    }

    if generator_type == "table":
        normalized["data"] = {
            "subType": raw.get("subType", "simple"),
            "options": raw.get("options", []),
            "variants": raw.get("variants", []),
            "fields": raw.get("fields", []),
            "multiTables": raw.get("multiTables") or raw.get("tables", {}),
        }
    elif generator_type == "note":
        normalized["data"] = {
            "blocks": raw.get("blocks", []),
        }
    elif generator_type == "character":
        normalized["data"] = {
            "edition": raw.get("edition"),
            "race": raw.get("race"),
            "profession": raw.get("profession"),
            "stats": raw.get("stats", {}),
            "secondaryStats": raw.get("secondaryStats", {}),
            "skills": raw.get("skills", ""),
            "talents": raw.get("talents", ""),
            "equipment": raw.get("equipment", ""),
            "notes": raw.get("notes", ""),
        }

    return normalized


def seed_builtin_generators(db: Session):
    if not BUILTIN_DIR.exists():
        return

    for json_file in BUILTIN_DIR.rglob("*.json"):
        with open(json_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        data = _normalize_builtin_generator(raw_data)

        exists = (
            db.query(GeneratorDB)
            .filter(GeneratorDB.legacy_id == data["legacy_id"])
            .first()
        )
        if exists:
            continue

        generator = GeneratorDB(
            legacy_id=data["legacy_id"],
            legacy_owner_id="system",
            name=data["name"],
            type=data["type"],
            description=data["description"],
            owner_id=None,
            owner_name=data["owner_name"],
            is_built_in=data["is_built_in"],
            tags=data["tags"],
            data=data["data"],
        )

        if data["created_at"]:
            generator.created_at = data["created_at"]

        db.add(generator)

    db.commit()


def run_seed(db: Session):
    seed_users(db)
    seed_builtin_generators(db)