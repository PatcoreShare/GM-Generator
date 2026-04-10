export interface TableOption {
  id: string;
  text: string;
  weight: number;
  nestedTableId?: string; // ID of another table to roll on if this option is selected
}

export type ArchiveType = 'table' | 'note' | 'character';

export interface TableVariant {
  id: string;
  name: string; // e.g., "Elf", "Człowiek"
  options: TableOption[];
}

export interface TableField {
  label: string;
  source: string; // key in multiTables
}

export interface RandomTable {
  id: string;
  name: string;
  description: string;
  type: 'table';
  subType: 'simple' | 'complex';
  options: TableOption[]; // for simple
  variants?: TableVariant[]; // for simple
  fields?: TableField[]; // for complex
  multiTables?: Record<string, TableOption[]>; // for complex
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  createdAt: string;
}

export interface NoteBlock {
  id: string;
  type: 'text' | 'image';
  content: string; // text content or image URL
  width?: string; // for images
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
  createdAt: string;
}

export interface CharacterArchive {
  id: string;
  name: string;
  type: 'character';
  edition: '2ed' | '4ed';
  race: string;
  profession: string;
  description: string;
  stats: Record<string, number>;
  secondaryStats?: Record<string, number>;
  skills: string[];
  talents: string[];
  equipment: string[];
  notes: string;
  tags?: string[];
  ownerId: string;
  ownerName?: string;
  isBuiltIn?: boolean;
  createdAt: string;
}

export type ArchiveItem = RandomTable | NoteArchive | CharacterArchive;

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface ImportExportData {
  generators: ArchiveItem[];
}