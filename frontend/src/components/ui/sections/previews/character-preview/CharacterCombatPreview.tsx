import {
  CharacterMeleeWeapon,
  CharacterRangedWeapon,
} from '../../../../../types';

interface CharacterCombatPreviewProps {
  meleeCols: { left: CharacterMeleeWeapon[]; right: CharacterMeleeWeapon[] };
  rangedCols: { left: CharacterRangedWeapon[]; right: CharacterRangedWeapon[] };
}

function MeleeWeaponsPreview({
  title,
  cols,
  emptyText,
}: {
  title: string;
  cols: { left: CharacterMeleeWeapon[]; right: CharacterMeleeWeapon[] };
  emptyText: string;
}) {
  const { left, right } = cols;

  const render = (item: CharacterMeleeWeapon, key: string | number) => (
    <div
      key={key}
      className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-2 min-w-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <span className="font-bold text-primary break-words">{item.name || '—'}</span>
        {item.group ? (
          <span className="text-xs text-primary/60 break-words">Grupa: {item.group}</span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-primary/70 text-xs min-w-0">
        <span>Obrażenia: {item.damage || '—'}</span>
        {item.reach ? <span>Zasięg: {item.reach}</span> : null}
        <span>Obciążenie: {item.encumbrance ?? '—'}</span>
        {item.cost ? <span>Koszt: {item.cost}</span> : null}
      </div>

      {(item.qualities || item.qualitiesFlaws) && (
        <div className="text-xs text-primary/70 italic border-t border-primary/5 mt-1 pt-1 break-words">
          Cechy: {item.qualities || item.qualitiesFlaws}
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
          <div className="space-y-2 min-w-0">
            {left.map((item, idx) => render(item, item.id || `l-${idx}`))}
          </div>
          <div className="space-y-2 min-w-0">
            {right.map((item, idx) => render(item, item.id || `r-${idx}`))}
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">{emptyText}</p>
      )}
    </div>
  );
}

function RangedWeaponsPreview({
  title,
  cols,
  emptyText,
}: {
  title: string;
  cols: { left: CharacterRangedWeapon[]; right: CharacterRangedWeapon[] };
  emptyText: string;
}) {
  const { left, right } = cols;

  const render = (item: CharacterRangedWeapon, key: string | number) => (
    <div
      key={key}
      className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-2 min-w-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <span className="font-bold text-primary break-words">{item.name || '—'}</span>
        {item.group ? (
          <span className="text-xs text-primary/60 break-words">Grupa: {item.group}</span>
        ) : item.ammoType ? (
          <span className="text-xs text-primary/60 break-words">
            Amunicja: {item.ammoType}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-primary/70 text-xs min-w-0">
        <span>Obrażenia: {item.damage || '—'}</span>
        <span>Zasięg: {item.range || '—'}</span>
        <span>Przeładowanie: {item.reload || '—'}</span>
        <span>Obciążenie: {item.encumbrance ?? '—'}</span>
        {item.cost ? <span>Koszt: {item.cost}</span> : null}
      </div>

      {(item.qualities || item.qualitiesFlaws) && (
        <div className="text-xs text-primary/70 italic border-t border-primary/5 mt-1 pt-1 break-words">
          Cechy: {item.qualities || item.qualitiesFlaws}
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
          <div className="space-y-2 min-w-0">
            {left.map((item, idx) => render(item, item.id || `l-${idx}`))}
          </div>
          <div className="space-y-2 min-w-0">
            {right.map((item, idx) => render(item, item.id || `r-${idx}`))}
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">{emptyText}</p>
      )}
    </div>
  );
}

export function CharacterCombatPreview({
  meleeCols,
  rangedCols,
}: CharacterCombatPreviewProps) {
  return (
    <div className="space-y-8">
      <MeleeWeaponsPreview
        title="Broń Biała"
        cols={meleeCols}
        emptyText="Brak broni białej."
      />
      <RangedWeaponsPreview
        title="Broń Strzelecka"
        cols={rangedCols}
        emptyText="Brak broni strzeleckiej."
      />
    </div>
  );
}