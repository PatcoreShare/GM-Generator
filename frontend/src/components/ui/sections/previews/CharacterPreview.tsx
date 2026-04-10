import {
  CharacterArchive,
  CharacterEquipmentItem,
  CharacterMeleeWeapon,
  CharacterRangedWeapon,
  CharacterArmourItem,
  CharacterSkillItem,
  CharacterTalentItem,
} from '../../../../types';
import { Users } from 'lucide-react';
import { CharacterStatsTable } from './character-preview/CharacterStatsTable';
import { CharacterCombatPreview } from './character-preview/CharacterCombatPreview';
import { CharacterArmourPreview } from './character-preview/CharacterArmourPreview';
import { CharacterInventoryPreview } from './character-preview/CharacterInventoryPreview';
import { split2 } from './character-preview/characterPreview.utils';

interface CharacterPreviewProps {
  previewItem: CharacterArchive;
}

function SkillPreview({
  title,
  cols,
  emptyText,
}: {
  title: string;
  cols: { left: CharacterSkillItem[]; right: CharacterSkillItem[] };
  emptyText: string;
}) {
  const { left, right } = cols;

  return (
    <div className="space-y-3 min-w-0">
      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
        {title}
      </h4>

      {left.length + right.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
          <div className="space-y-2 min-w-0">
            {left.map((item) => (
              <div
                key={item.id}
                className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-1 min-w-0"
              >
                <div className="text-xs text-primary/60">
                  Cecha: {item.characteristic || '—'}
                </div>
                <div className="font-bold text-primary break-words">
                  {item.name || '—'}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 min-w-0">
            {right.map((item) => (
              <div
                key={item.id}
                className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-1 min-w-0"
              >
                <div className="text-xs text-primary/60">
                  Cecha: {item.characteristic || '—'}
                </div>
                <div className="font-bold text-primary break-words">
                  {item.name || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">{emptyText}</p>
      )}
    </div>
  );
}

function TalentPreview({
  title,
  cols,
  emptyText,
}: {
  title: string;
  cols: { left: CharacterTalentItem[]; right: CharacterTalentItem[] };
  emptyText: string;
}) {
  const { left, right } = cols;

  const render = (item: CharacterTalentItem) => (
    <div
      key={item.id}
      className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-1 min-w-0"
    >
      <div className="font-bold text-primary break-words">{item.name || '—'}</div>
      {item.description && (
        <div className="text-xs text-primary/70 italic border-t border-primary/5 mt-1 pt-1 break-words">
          {item.description}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3 min-w-0">
      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
        {title}
      </h4>

      {left.length + right.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
          <div className="space-y-2 min-w-0">{left.map(render)}</div>
          <div className="space-y-2 min-w-0">{right.map(render)}</div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">{emptyText}</p>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-background/30 p-3 rounded border border-primary/10 text-center min-w-0">
      <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
        {label}
      </span>
      <span className="font-bold text-primary break-words">{value}</span>
    </div>
  );
}

export function CharacterPreview({ previewItem }: CharacterPreviewProps) {
  const skills = Array.isArray(previewItem.skills)
    ? (previewItem.skills as CharacterSkillItem[])
    : [];

  const talents = Array.isArray(previewItem.talents)
    ? (previewItem.talents as CharacterTalentItem[])
    : [];

  const meleeWeapons = Array.isArray(previewItem.meleeWeapons)
    ? (previewItem.meleeWeapons as CharacterMeleeWeapon[])
    : [];

  const rangedWeapons = Array.isArray(previewItem.rangedWeapons)
    ? (previewItem.rangedWeapons as CharacterRangedWeapon[])
    : [];

  const armour = Array.isArray(previewItem.armour)
    ? (previewItem.armour as CharacterArmourItem[])
    : [];

  const equipment = Array.isArray(previewItem.equipment)
    ? (previewItem.equipment as CharacterEquipmentItem[])
    : [];

  const skillCols = split2(skills);
  const talentCols = split2(talents);
  const meleeCols = split2(meleeWeapons);
  const rangedCols = split2(rangedWeapons);
  const armourCols = split2(armour);
  const equipmentCols = split2(equipment);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full min-w-0 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-6 rounded border border-primary/10 min-w-0">
        <div className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
            Rasa
          </span>
          <span className="text-lg font-bold text-primary break-words">
            {previewItem.race || '—'}
          </span>
        </div>

        <div className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
            System
          </span>
          <span className="text-lg font-bold text-primary break-words">
            Warhammer {previewItem.edition || '—'}
          </span>
        </div>
      </div>

      <CharacterStatsTable previewItem={previewItem} />

      <div className="bg-primary/5 p-4 rounded border border-primary/10 min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
          Profesja
        </span>
        <span className="text-lg font-bold text-primary break-words">
          {previewItem.profession || '—'}
        </span>
      </div>

      <SkillPreview title="Umiejętności" cols={skillCols} emptyText="Brak umiejętności." />
      <TalentPreview title="Zdolności" cols={talentCols} emptyText="Brak zdolności." />

      <CharacterCombatPreview
        meleeCols={meleeCols}
        rangedCols={rangedCols}
      />

      <CharacterArmourPreview armour={armour} armourCols={armourCols} />

      <CharacterInventoryPreview
        title="Ekwipunek"
        cols={equipmentCols}
        emptyText="Brak ekwipunku."
      />

      <div className="space-y-3 min-w-0">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
          Obciążenie
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
          <InfoBox label="Aktualne" value={previewItem.encumbrance?.current ?? '—'} />
          <InfoBox label="Maksymalne" value={previewItem.encumbrance?.max ?? '—'} />
          <InfoBox label="Notatka" value={previewItem.encumbrance?.notes || '—'} />
        </div>
      </div>

      <div className="space-y-3 min-w-0">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
          Notatki
        </h4>
        <p className="font-serif italic text-primary/80 whitespace-pre-wrap break-words">
          {previewItem.notes || 'Brak notatek.'}
        </p>
      </div>

      <div className="hidden">
        <Users />
      </div>
    </div>
  );
}