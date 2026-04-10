from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_auth import router as auth_router
from app.api.routes_generators import router as generators_router
from app.api.routes_import_export import router as import_export_router
from app.core.config import settings
from app.db import Base, SessionLocal, engine
from app.seed import run_seed

app = FastAPI(title="GM Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    run_seed(db)

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(generators_router, prefix="/api", tags=["generators"])
app.include_router(import_export_router, prefix="/api", tags=["import-export"])


@app.get("/health")
def health():
    return {"status": "ok"}