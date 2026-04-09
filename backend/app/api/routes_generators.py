import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import GeneratorDB
from app.models.schemas import GeneratorPayload
from app.services.storage import generator_to_response, upsert_generator

router = APIRouter()


@router.get("/generators")
def get_generators(
    userId: str | None = Query(default=None),
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(GeneratorDB)

    if role != "admin":
        if not userId:
            return []
        try:
            owner_uuid = uuid.UUID(userId)
        except ValueError:
            raise HTTPException(status_code=400, detail="Nieprawidłowy userId")

        query = query.filter(
            or_(GeneratorDB.owner_id == owner_uuid, GeneratorDB.is_built_in.is_(True))
        )

    items = query.order_by(GeneratorDB.created_at.desc()).all()
    return [generator_to_response(item) for item in items]


@router.post("/generators")
def save_generator(payload: GeneratorPayload, db: Session = Depends(get_db)):
    result = upsert_generator(db, payload.model_dump())
    return result


@router.delete("/generators/{generator_id}")
def delete_generator(generator_id: str, db: Session = Depends(get_db)):
    try:
        obj = db.get(GeneratorDB, uuid.UUID(generator_id))
    except ValueError:
        raise HTTPException(status_code=400, detail="Nieprawidłowe ID")

    if not obj:
        raise HTTPException(status_code=404, detail="Nie znaleziono generatora")

    db.delete(obj)
    db.commit()
    return {"success": True}