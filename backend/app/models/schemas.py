from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    role: str


class GeneratorPayload(BaseModel):
    id: str | None = None
    name: str
    type: Literal["table", "note", "character"]
    description: str | None = None
    ownerId: str | None = None
    ownerName: str | None = None
    isBuiltIn: bool = False
    tags: list[str] = Field(default_factory=list)
    createdAt: datetime | None = None

    subType: str | None = None
    options: list[dict[str, Any]] | None = None
    variants: list[dict[str, Any]] | None = None
    fields: list[dict[str, Any]] | None = None
    multiTables: dict[str, Any] | None = None

    blocks: list[dict[str, Any]] | None = None

    edition: str | None = None
    race: str | None = None
    profession: str | None = None
    stats: dict[str, Any] | None = None
    secondaryStats: dict[str, Any] | None = None
    skills: str | None = None
    talents: str | None = None
    equipment: str | None = None
    notes: str | None = None


class ImportPayload(BaseModel):
    generators: list[GeneratorPayload]


class ExportResponse(BaseModel):
    generators: list[dict[str, Any]]