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


class CharacterSkillItemPayload(BaseModel):
    id: str | None = None
    characteristic: str | None = None
    name: str


class CharacterTalentItemPayload(BaseModel):
    id: str | None = None
    name: str
    description: str | None = None


class CharacterEquipmentItemPayload(BaseModel):
    id: str | None = None
    name: str
    quantity: int | str | None = 1
    encumbrance: int | str | None = 0
    cost: str | None = None
    notes: str | None = None


class CharacterMeleeWeaponPayload(BaseModel):
    id: str | None = None
    name: str
    group: str | None = None
    damage: str | None = None
    reach: str | None = None
    qualities: str | None = None
    qualitiesFlaws: str | None = None
    encumbrance: int | str | None = 0
    cost: str | None = None


class CharacterRangedWeaponPayload(BaseModel):
    id: str | None = None
    name: str
    group: str | None = None
    range: str | None = None
    damage: str | None = None
    reload: str | None = None
    ammoType: str | None = None
    qualities: str | None = None
    qualitiesFlaws: str | None = None
    encumbrance: int | str | None = 0
    cost: str | None = None


class CharacterArmourItemPayload(BaseModel):
    id: str | None = None
    name: str
    location: str | None = None
    value: int | str | None = None
    head: int | str | None = None
    body: int | str | None = None
    arms: int | str | None = None
    legs: int | str | None = None
    specialRules: str | None = None
    qualities: str | None = None
    encumbrance: int | str | None = 0
    cost: str | None = None


class CharacterEncumbrancePayload(BaseModel):
    current: int | str | None = None
    max: int | str | None = None
    notes: str | None = None


class GeneratorPayload(BaseModel):
    id: str | None = None
    name: str
    type: Literal["table", "note", "character", "dice"]
    description: str | None = None
    ownerId: str | None = None
    ownerName: str | None = None
    isBuiltIn: bool = False
    isVisible: bool = True
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

    skills: list[CharacterSkillItemPayload] | list[str] | None = None
    talents: list[CharacterTalentItemPayload] | list[str] | None = None
    equipment: list[CharacterEquipmentItemPayload] | list[str] | None = None

    meleeWeapons: list[CharacterMeleeWeaponPayload] | list[str] | None = None
    rangedWeapons: list[CharacterRangedWeaponPayload] | list[str] | None = None
    armour: list[CharacterArmourItemPayload] | list[str] | None = None
    encumbrance: CharacterEncumbrancePayload | dict[str, Any] | None = None

    notes: str | None = None

    formula: str | None = None


class ImportPayload(BaseModel):
    generators: list[GeneratorPayload]


class ExportResponse(BaseModel):
    generators: list[dict[str, Any]]