import { CharacterArmourItem } from '../../../../../types';
import { getArmourTotals } from './characterPreview.utils';

interface CharacterArmourPreviewProps {
  armour: CharacterArmourItem[];
  armourCols: { left: CharacterArmourItem[]; right: CharacterArmourItem[] };
}

function ArmourList({
  cols,
  emptyText,
}: {
  cols: { left: CharacterArmourItem[]; right: CharacterArmourItem[] };
  emptyText: string;
}) {
  const { left, right } = cols;

  const render = (item: CharacterArmourItem, key: string | number) => (
    <div
      key={key}
      className="bg-background/30 p-3 rounded border border-primary/10 text-sm space-y-2 min-w-0"
    >
      <div className="font-bold text-primary break-words">{item.name || '—'}</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-primary/70">
        <span>Głowa: {item.head ?? '—'}</span>
        <span>Korpus: {item.body ?? '—'}</span>
        <span>Ręce: {item.arms ?? '—'}</span>
        <span>Nogi: {item.legs ?? '—'}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-primary/70 text-xs min-w-0">
        <span>Obciążenie: {item.encumbrance ?? '—'}</span>
        {item.cost ? <span>Koszt: {item.cost}</span> : null}
      </div>

      {item.specialRules && (
        <div className="text-xs text-primary/70 italic border-t border-primary/5 mt-1 pt-1 break-words">
          Zasady specjalne: {item.specialRules}
        </div>
      )}
    </div>
  );

  return left.length + right.length > 0 ? (
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
  );
}

export function CharacterArmourPreview({
  armour,
  armourCols,
}: CharacterArmourPreviewProps) {
  const armourTotals = getArmourTotals(armour);

  return (
    <div className="space-y-3 min-w-0">
      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
        Pancerz
      </h4>

      <div className="w-full min-w-0 overflow-x-auto">
        <div className="w-full min-w-0 border border-primary/10 rounded-sm">
          <table className="w-full border-collapse table-auto min-w-0">
            <thead>
              <tr className="bg-primary/10">
                <th className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center uppercase whitespace-nowrap">
                  PZ Głowa
                </th>
                <th className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center uppercase whitespace-nowrap">
                  PZ Korpus
                </th>
                <th className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center uppercase whitespace-nowrap">
                  PZ Ręce
                </th>
                <th className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center uppercase whitespace-nowrap">
                  PZ Nogi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary text-base bg-background/50 whitespace-nowrap">
                  {armourTotals.head}
                </td>
                <td className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary text-base bg-background/50 whitespace-nowrap">
                  {armourTotals.body}
                </td>
                <td className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary text-base bg-background/50 whitespace-nowrap">
                  {armourTotals.arms}
                </td>
                <td className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary text-base bg-background/50 whitespace-nowrap">
                  {armourTotals.legs}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ArmourList cols={armourCols} emptyText="Brak pancerza." />
    </div>
  );
}