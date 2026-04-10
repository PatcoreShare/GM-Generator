import { CharacterEquipmentItem } from '../../../../../types';

interface CharacterInventoryPreviewProps {
  title: string;
  cols: { left: CharacterEquipmentItem[]; right: CharacterEquipmentItem[] };
  emptyText: string;
}

export function CharacterInventoryPreview({
  title,
  cols,
  emptyText,
}: CharacterInventoryPreviewProps) {
  const { left, right } = cols;

  const render = (item: CharacterEquipmentItem, key: string | number) => (
    <div
      key={key}
      className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-1 min-w-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <span className="font-bold text-primary break-words">{item.name || '—'}</span>
        <span className="text-xs text-primary/60">Ilość: {item.quantity ?? 1}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-primary/70 text-xs min-w-0">
        <span>Obciążenie: {item.encumbrance ?? '—'}</span>
        {item.cost ? <span>Koszt: {item.cost}</span> : null}
      </div>

      {item.notes && (
        <div className="text-xs text-primary/70 italic border-t border-primary/5 mt-1 pt-1 break-words">
          Notatki: {item.notes}
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