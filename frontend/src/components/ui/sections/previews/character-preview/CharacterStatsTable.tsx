import { CharacterArchive } from '../../../../../types';

interface CharacterStatsTableProps {
  previewItem: CharacterArchive;
}

const STATS_2ED = ['WW', 'US', 'K', 'Odp', 'Zr', 'Int', 'SW', 'Ogd'];
const STATS_4ED = ['WW', 'US', 'S', 'Wt', 'Zr', 'I', 'Dex', 'Int', 'SW', 'Ogd'];
const SECONDARY_STATS_2ED = ['A', 'Żyw', 'S', 'Wt', 'Sz', 'Mag', 'PO', 'PP'];

export function CharacterStatsTable({ previewItem }: CharacterStatsTableProps) {
  const statsOrder = previewItem.edition === '2ed' ? STATS_2ED : STATS_4ED;

  return (
    <div className="space-y-4 w-full min-w-0">
      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
        Statystyki Główne
      </h4>

      <div className="w-full min-w-0 overflow-x-auto">
        <div className="w-full min-w-0 border border-primary/10 rounded-sm">
          <table className="w-full border-collapse table-auto min-w-0">
            <thead>
              <tr className="bg-primary/10">
                {statsOrder.map((s) => (
                  <th
                    key={s}
                    className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center align-middle uppercase whitespace-nowrap"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {statsOrder.map((s) => (
                  <td
                    key={s}
                    className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary text-base bg-background/50 whitespace-nowrap"
                  >
                    {previewItem.stats?.[s] ?? 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {previewItem.edition === '2ed' && (
        <div className="mt-6 w-full min-w-0">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
            Statystyki Poboczne
          </h4>

          <div className="w-full min-w-0 overflow-x-auto mt-4">
            <div className="w-full min-w-0 border border-primary/10 rounded-sm">
              <table className="w-full border-collapse table-auto min-w-0">
                <thead>
                  <tr className="bg-primary/5">
                    {SECONDARY_STATS_2ED.map((s) => (
                      <th
                        key={s}
                        className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary/60 text-center align-middle uppercase whitespace-nowrap"
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {SECONDARY_STATS_2ED.map((s) => (
                      <td
                        key={s}
                        className="border border-primary/20 px-2 py-3 text-center align-middle font-bold text-primary/80 bg-background/30 whitespace-nowrap"
                      >
                        {previewItem.secondaryStats?.[s] ?? 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}