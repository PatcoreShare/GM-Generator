import { Input } from '../../input';
import { SystemCharacterSectionProps } from '../character.types';

interface Warhammer2SectionProps extends SystemCharacterSectionProps {
  stats2ed: string[];
  secondaryStats2ed: string[];
}

export function Warhammer2Section({
  race,
  setRace,
  stats,
  setStats,
  secondaryStats,
  setSecondaryStats,
  stats2ed,
  secondaryStats2ed,
}: Warhammer2SectionProps) {
  const updateMainStat = (key: string, raw: string) => {
    if (raw === '') {
      setStats((prev) => ({
        ...prev,
        [key]: 0,
      }));
      return;
    }

    const parsed = parseInt(raw, 10);
    const clamped = Math.max(0, Math.min(99, Number.isNaN(parsed) ? 0 : parsed));

    setStats((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  const updateSecondaryStat = (key: string, raw: string) => {
    if (raw === '') {
      setSecondaryStats((prev) => ({
        ...prev,
        [key]: 0,
      }));
      return;
    }

    const parsed = parseInt(raw, 10);
    const clamped = Math.max(0, Math.min(99, Number.isNaN(parsed) ? 0 : parsed));

    setSecondaryStats((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  return (
    <div className="space-y-5 w-full">
      <div className="grid grid-cols-1 md:grid-cols-[90px_minmax(0,1fr)] gap-3 items-center">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Rasa:
        </label>

        <Input
          value={race}
          onChange={(e) => setRace(e.target.value)}
          placeholder="Wpisz rasę..."
          className="bg-background border-primary/30 h-10 text-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
          Statystyki Główne — Warhammer 2ed
        </label>

        <div className="w-full overflow-x-auto border border-primary/20 rounded-md bg-background/40">
          <table className="w-full min-w-[620px] border-collapse table-fixed">
            <thead>
              <tr className="bg-primary/10">
                {stats2ed.map((s) => (
                  <th
                    key={s}
                    className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary text-center uppercase"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {stats2ed.map((s) => (
                  <td key={s} className="border border-primary/20 p-0 bg-background/70">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={stats[s] ?? 0}
                      onChange={(e) => updateMainStat(s, e.target.value)}
                      onBlur={(e) => updateMainStat(s, e.target.value)}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      onFocus={(e) => e.target.select()}
                      className="w-full min-w-[60px] bg-transparent border-none text-center px-2 py-3 font-bold text-sm focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
          Statystyki Poboczne — Warhammer 2ed
        </label>

        <div className="w-full overflow-x-auto border border-primary/20 rounded-md bg-background/30">
          <table className="w-full min-w-[620px] border-collapse table-fixed">
            <thead>
              <tr className="bg-primary/5">
                {secondaryStats2ed.map((s) => (
                  <th
                    key={s}
                    className="border border-primary/20 px-2 py-2 text-[10px] font-black text-primary/70 text-center uppercase"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {secondaryStats2ed.map((s) => (
                  <td key={s} className="border border-primary/20 p-0 bg-background/60">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={secondaryStats[s] ?? 0}
                      onChange={(e) => updateSecondaryStat(s, e.target.value)}
                      onBlur={(e) => updateSecondaryStat(s, e.target.value)}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      onFocus={(e) => e.target.select()}
                      className="w-full min-w-[60px] bg-transparent border-none text-center px-2 py-3 font-bold text-sm focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] italic text-primary/50">
          Główne: WW, US, K, Odp, Zr, Int, SW, Ogd. Poboczne: A, Żyw, SB, TB, Mag, PO, PP.
        </p>
      </div>
    </div>
  );
}