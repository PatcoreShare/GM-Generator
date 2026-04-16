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
        "legacy_id": str(legacy_id),
        "name": raw.get("name") or raw.get("title") or "Bez nazwy",
        "type": generator_type,
        "description": raw.get("description"),
        "owner_name": raw.get("ownerName") or "System",
        "is_visible": raw.get("isVisible", True),
        "tags": raw.get("tags", []),
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

def _extract_generators(raw_data) -> list[dict]:
    if isinstance(raw_data, dict):
        if "generators" in raw_data:
            generators = raw_data.get("generators", [])
            if not isinstance(generators, list):
                raise ValueError("'generators' must be a list")
            return [item for item in generators if isinstance(item, dict)]
        return [raw_data]

    if isinstance(raw_data, list):
        return [item for item in raw_data if isinstance(item, dict)]

    raise ValueError("JSON root must be an object, array, or object with 'generators'")

def seed_builtin_generators(db: Session):
    if not BUILTIN_DIR.exists():
        return

    for json_file in BUILTIN_DIR.rglob("*.json"):
        with open(json_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        try:
            raw_generators = _extract_generators(raw_data)
        except ValueError as e:
            print(f"[seed] Pomijam plik {json_file.name}: {e}")
            continue

        for raw_generator in raw_generators:
            try:
                data = _normalize_builtin_generator(raw_generator)
            except ValueError as e:
                print(f"[seed] Pomijam wpis w {json_file.name}: {e}")
                continue

            exists = (
                db.query(GeneratorDB)
                .filter(GeneratorDB.legacy_id == data["legacy_id"])
                .first()
            )

            if exists:
                exists.legacy_owner_id = "system"
                exists.name = data["name"]
                exists.type = data["type"]
                exists.description = data["description"]
                exists.owner_id = None
                exists.owner_name = data["owner_name"]
                exists.is_visible = data["is_visible"]
                exists.tags = data["tags"]
                exists.data = data["data"]

                if data["created_at"]:
                    exists.created_at = data["created_at"]

                continue

            generator = GeneratorDB(
                legacy_id=data["legacy_id"],
                legacy_owner_id="system",
                name=data["name"],
                type=data["type"],
                description=data["description"],
                owner_id=None,
                owner_name=data["owner_name"],
                is_visible=data["is_visible"],
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