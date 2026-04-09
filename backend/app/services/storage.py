from datetime import datetime
import uuid

from sqlalchemy.orm import Session

from app.models.db_models import GeneratorDB, UserDB


def parse_uuid(value: str | None):
    if not value:
        return None
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError):
        return None


def resolve_owner(db: Session, owner_id_raw: str | None, owner_name: str | None):
    parsed_owner_uuid = parse_uuid(owner_id_raw)

    if parsed_owner_uuid:
        user = db.get(UserDB, parsed_owner_uuid)
        if user:
            return parsed_owner_uuid, user.username, None

    if owner_name:
        user_by_name = db.query(UserDB).filter(UserDB.username == owner_name).first()
        if user_by_name:
            return user_by_name.id, user_by_name.username, owner_id_raw

    return None, owner_name, owner_id_raw


def generator_to_response(generator: GeneratorDB) -> dict:
    payload = {
        "id": generator.legacy_id or str(generator.id),
        "name": generator.name,
        "type": generator.type,
        "description": generator.description,
        "ownerId": str(generator.owner_id) if generator.owner_id else generator.legacy_owner_id,
        "ownerName": generator.owner_name,
        "isBuiltIn": generator.is_built_in,
        "tags": generator.tags or [],
        "createdAt": generator.created_at.isoformat(),
    }
    payload.update(generator.data or {})
    return payload


def upsert_generator(db: Session, payload: dict) -> dict:
    incoming_id = payload.get("id")
    parsed_generator_uuid = parse_uuid(incoming_id)

    owner_id, owner_name, legacy_owner_id = resolve_owner(
        db,
        payload.get("ownerId"),
        payload.get("ownerName"),
    )

    generator = None

    if parsed_generator_uuid:
        generator = db.get(GeneratorDB, parsed_generator_uuid)

    if not generator and incoming_id and not parsed_generator_uuid:
        generator = (
            db.query(GeneratorDB)
            .filter(GeneratorDB.legacy_id == str(incoming_id))
            .first()
        )

    base_fields = {
        "legacy_id": None if parsed_generator_uuid else (str(incoming_id) if incoming_id else None),
        "legacy_owner_id": legacy_owner_id,
        "name": payload["name"],
        "type": payload["type"],
        "description": payload.get("description"),
        "owner_id": owner_id,
        "owner_name": owner_name,
        "is_built_in": payload.get("isBuiltIn", False),
        "tags": payload.get("tags", []),
    }

    extra_data = {
        k: v for k, v in payload.items()
        if k not in {
            "id",
            "name",
            "type",
            "description",
            "ownerId",
            "ownerName",
            "isBuiltIn",
            "tags",
            "createdAt",
        }
    }

    if generator:
        for key, value in base_fields.items():
            setattr(generator, key, value)
        generator.data = extra_data
        generator.updated_at = datetime.utcnow()
    else:
        generator = GeneratorDB(
            id=parsed_generator_uuid or uuid.uuid4(),
            created_at=datetime.utcnow(),
            data=extra_data,
            **base_fields,
        )
        db.add(generator)

    db.commit()
    db.refresh(generator)
    return generator_to_response(generator)