from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import GeneratorDB
from app.models.schemas import ImportPayload
from app.services.storage import generator_to_response, upsert_generator

router = APIRouter()


@router.post("/import")
def import_generators(payload: ImportPayload, db: Session = Depends(get_db)):
    imported = 0
    errors = []

    for item in payload.generators:
        try:
            upsert_generator(db, item.model_dump())
            imported += 1
        except Exception as exc:
            db.rollback()
            errors.append({
                "id": item.id,
                "name": item.name,
                "error": str(exc),
            })

    return {
        "success": len(errors) == 0,
        "imported": imported,
        "failed": len(errors),
        "errors": errors,
    }


@router.get("/export")
def export_generators(db: Session = Depends(get_db)):
    items = db.query(GeneratorDB).all()
    return {"generators": [generator_to_response(item) for item in items]}