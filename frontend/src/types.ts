export interface TableOption {
  id: string;
  text: string;
  weight: number;
  nestedTableId?: string;
}

export type ArchiveType = 'table' | 'note' | 'character';

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
  isVisible?: boolean;
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