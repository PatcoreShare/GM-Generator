export interface TableOption {
  id: string;
  text: string;
  weight: number;
  nestedTableId?: string;
}

export type ArchiveType = 'table' | 'note' | 'character' | 'dice';

export interface TableVariant {
  id: string;
  name: string;
  options: TableOption[];
}

export interface TableField {
  label: string;
  source: string;
}

export interface RandomTable {
  id: string;
  name: string;
  description: string;
  type: 'table';
  subType: 'simple' | 'complex';
  options: TableOption[];
  variants?: TableVariant[];
  fields?: TableField[];
  multiTables?: Record<string, TableOption[]>;
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  isVisible?: boolean;
  createdAt: string;
}

export interface NoteBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  width?: string;
}

export interface NoteArchive {
  id: string;
  name: string;
  type: 'note';
  blocks: NoteBlock[];
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  isVisible?: boolean;
  createdAt: string;
}

export interface CharacterSkillItem {
  id: string;
  characteristic: string;
  name: string;
}

export interface CharacterTalentItem {
  id: string;
  name: string;
  description?: string;
}

export interface CharacterEquipmentItem {
  id: string;
  name: string;
  quantity?: number | string;
  encumbrance?: number | string;
}

export interface CharacterMeleeWeapon {
  id: string;
  name: string;
  group?: string;

  // 2ed: np. SB, SB+1, SB+2
  // 4ed: np. +4
  damage?: string;

  // 4ed
  reach?: string;

  // 2ed lub ogólne
  qualities?: string;

  // 4ed
  qualitiesFlaws?: string;

  encumbrance?: number | string;
  cost?: string;
}

export interface CharacterRangedWeapon {
  id: string;
  name: string;
  range?: string;

  // 2ed: np. SB, SB+3
  // 4ed: np. +6
  damage?: string;

  reload?: string;

  // 2ed lub ogólne
  qualities?: string;

  // 4ed
  qualitiesFlaws?: string;

  // 4ed
  ammoType?: string;

  encumbrance?: number | string;
  cost?: string;
}

export interface CharacterArmourItem {
  id: string;
  name: string;

  // lokacyjne AP
  head?: number | string;
  body?: number | string;
  arms?: number | string;
  legs?: number | string;

  // 2ed
  specialRules?: string;

  // 4ed
  qualities?: string;

  encumbrance?: number | string;
}

export interface CharacterArchive {
  id: string;
  name: string;
  type: 'character';
  edition: '2ed' | '4ed';
  race: string;
  profession: string;
  description: string;
  stats: Record<string, number | string>;
  secondaryStats?: Record<string, number | string>;
  skills: CharacterSkillItem[];
  talents: CharacterTalentItem[];

  // zwykły ekwipunek / trappings
  equipment: CharacterEquipmentItem[];

  // wyposażenie bojowe
  meleeWeapons?: CharacterMeleeWeapon[];
  rangedWeapons?: CharacterRangedWeapon[];
  armour?: CharacterArmourItem[];

  // obciążenie
  encumbrance?: {
    current?: number | string;
    max?: number | string;
    notes?: string;
  };

  notes: string;
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  isVisible?: boolean;
  createdAt: string;
}

export interface DiceArchive {
  id: string;
  name: string;
  type: 'dice';
  formula: string;
  description?: string;
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  isVisible?: boolean;
  createdAt: string;
}

export type ArchiveItem = RandomTable | NoteArchive | CharacterArchive | DiceArchive;

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface ImportExportData {
  generators: ArchiveItem[];
}