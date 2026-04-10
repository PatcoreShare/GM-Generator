import { CharacterEdition } from './character.types';
import { CharacterBasicsSection } from './CharacterBasicsSection';
import { CharacterCombatSection } from './CharacterCombatSection';
import { SkillListSection } from './SkillListSection';
import { TalentListSection } from './TalentListSection';
import {
  CharacterArmourItem,
  CharacterEquipmentItem,
  CharacterMeleeWeapon,
  CharacterRangedWeapon,
  CharacterSkillItem,
  CharacterTalentItem,
} from '../../../types';

interface CharacterSectionProps {
  edition: CharacterEdition;
  setEdition: (value: CharacterEdition) => void;
  race: string;
  setRace: (value: string) => void;
  profession: string;
  setProfession: (value: string) => void;
  charDescription: string;
  setCharDescription: (value: string) => void;
  stats: Record<string, number>;
  setStats: (
    value:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
  secondaryStats: Record<string, number>;
  setSecondaryStats: (
    value:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
  skills: CharacterSkillItem[];
  setSkills: (
    value:
      | CharacterSkillItem[]
      | ((prev: CharacterSkillItem[]) => CharacterSkillItem[])
  ) => void;
  talents: CharacterTalentItem[];
  setTalents: (
    value:
      | CharacterTalentItem[]
      | ((prev: CharacterTalentItem[]) => CharacterTalentItem[])
  ) => void;
  equipment: CharacterEquipmentItem[];
  setEquipment: (
    value:
      | CharacterEquipmentItem[]
      | ((prev: CharacterEquipmentItem[]) => CharacterEquipmentItem[])
  ) => void;
  notes: string;
  setNotes: (value: string) => void;
  meleeWeapons: CharacterMeleeWeapon[];
  setMeleeWeapons: (
    value:
      | CharacterMeleeWeapon[]
      | ((prev: CharacterMeleeWeapon[]) => CharacterMeleeWeapon[])
  ) => void;
  rangedWeapons: CharacterRangedWeapon[];
  setRangedWeapons: (
    value:
      | CharacterRangedWeapon[]
      | ((prev: CharacterRangedWeapon[]) => CharacterRangedWeapon[])
  ) => void;
  armour: CharacterArmourItem[];
  setArmour: (
    value:
      | CharacterArmourItem[]
      | ((prev: CharacterArmourItem[]) => CharacterArmourItem[])
  ) => void;
  encumbrance: {
    current?: number | string;
    max?: number | string;
    notes?: string;
  };
  setEncumbrance: any;
  stats2ed: string[];
  stats4ed: string[];
  secondaryStats2ed: string[];
}

export function CharacterSection({
  edition,
  setEdition,
  race,
  setRace,
  profession,
  setProfession,
  charDescription,
  setCharDescription,
  stats,
  setStats,
  secondaryStats,
  setSecondaryStats,
  skills,
  setSkills,
  talents,
  setTalents,
  equipment,
  setEquipment,
  notes,
  setNotes,
  meleeWeapons,
  setMeleeWeapons,
  rangedWeapons,
  setRangedWeapons,
  armour,
  setArmour,
  encumbrance,
  setEncumbrance,
  stats2ed,
  stats4ed,
  secondaryStats2ed,
}: CharacterSectionProps) {
  return (
    <div className="md:col-span-2 space-y-8">
      <CharacterBasicsSection
        edition={edition}
        setEdition={setEdition}
        race={race}
        setRace={setRace}
        profession={profession}
        setProfession={setProfession}
        charDescription={charDescription}
        setCharDescription={setCharDescription}
        stats={stats}
        setStats={setStats}
        secondaryStats={secondaryStats}
        setSecondaryStats={setSecondaryStats}
        stats2ed={stats2ed}
        stats4ed={stats4ed}
        secondaryStats2ed={secondaryStats2ed}
      />

      <div className="space-y-8">
        <SkillListSection items={skills} setItems={setSkills} />
        <TalentListSection items={talents} setItems={setTalents} />
      </div>

      <CharacterCombatSection
        meleeWeapons={meleeWeapons}
        setMeleeWeapons={setMeleeWeapons}
        rangedWeapons={rangedWeapons}
        setRangedWeapons={setRangedWeapons}
        armour={armour}
        setArmour={setArmour}
        equipment={equipment}
        setEquipment={setEquipment}
        encumbrance={encumbrance}
        setEncumbrance={setEncumbrance}
      />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Notatki / Historia
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 bg-background border border-primary/30 rounded p-4 font-serif italic focus:outline-none"
          placeholder="Dalsze zapiski..."
        />
      </div>
    </div>
  );
}