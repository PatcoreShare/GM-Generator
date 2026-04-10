import { Input } from '../input';
import { CharacterEdition } from './character.types';
import { Warhammer2Section, Warhammer4Section } from './systems';

interface CharacterBasicsSectionProps {
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
  stats2ed: string[];
  stats4ed: string[];
  secondaryStats2ed: string[];
}

export function CharacterBasicsSection({
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
  stats2ed,
  stats4ed,
  secondaryStats2ed,
}: CharacterBasicsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-4 rounded border border-primary/10 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">
              Edycja:
            </label>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={edition === '2ed'}
                  onChange={() => setEdition('2ed')}
                  className="accent-primary"
                />
                <span className="text-sm font-bold">Warhammer 2ed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={edition === '4ed'}
                  onChange={() => setEdition('4ed')}
                  className="accent-primary"
                />
                <span className="text-sm font-bold">Warhammer 4ed</span>
              </label>
            </div>
          </div>
        </div>

        {edition === '2ed' ? (
          <Warhammer2Section
            race={race}
            setRace={setRace}
            stats={stats}
            setStats={setStats}
            secondaryStats={secondaryStats}
            setSecondaryStats={setSecondaryStats}
            stats2ed={stats2ed}
            secondaryStats2ed={secondaryStats2ed}
          />
        ) : (
          <Warhammer4Section
            race={race}
            setRace={setRace}
            stats={stats}
            setStats={setStats}
            secondaryStats={secondaryStats}
            setSecondaryStats={setSecondaryStats}
            stats4ed={stats4ed}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Profesja
          </label>

          <Input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Wpisz profesję..."
            className="bg-background border-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Opis Wyglądu
          </label>

          <textarea
            value={charDescription}
            onChange={(e) => setCharDescription(e.target.value)}
            className="w-full h-24 bg-background border border-primary/30 rounded px-3 py-2 text-sm focus:outline-none"
            placeholder="Oczy, włosy, znaki szczególne..."
          />
        </div>
      </div>
    </div>
  );
}