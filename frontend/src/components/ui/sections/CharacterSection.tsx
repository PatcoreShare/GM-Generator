import { Input } from '../input';
import { Button } from '../button';
import { Dice5, Trash2 } from 'lucide-react';

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
  stats2ed,
  stats4ed,
  secondaryStats2ed,
  setShowTablePicker,
}) {
  return (
    <div className="md:col-span-2 space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center bg-primary/5 p-4 rounded border border-primary/10">
        <div className="flex gap-4 items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Edycja:
          </label>

          <div className="flex gap-4">
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

        <div className="h-8 w-px bg-primary/20 hidden sm:block" />

        <div className="flex gap-4 items-center flex-1">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Rasa:
          </label>

          {edition === '2ed' ? (
            <select
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="bg-background border border-primary/30 rounded px-2 py-1 text-sm focus:outline-none"
            >
              <option value="">Wybierz...</option>
              <option value="Człowiek">Człowiek</option>
              <option value="Krasnolud">Krasnolud</option>
              <option value="Elf">Elf</option>
              <option value="Niziołek">Niziołek</option>
            </select>
          ) : (
            <Input
              value={race}
              onChange={(e) => setRace(e.target.value)}
              placeholder="Wpisz rasę..."
              className="bg-background border-primary/30 h-8 text-sm"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Profesja
          </label>

          <div className="flex gap-2">
            <Input
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Wpisz profesję..."
              className="bg-background border-primary/30"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowTablePicker({ field: 'profession' })}
              className="border-primary/30 text-primary"
            >
              <Dice5 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Opis Wyglądu
          </label>
          <textarea
            value={charDescription}
            onChange={(e) => setCharDescription(e.target.value)}
            className="w-full h-10 bg-background border border-primary/30 rounded px-3 py-1 text-sm focus:outline-none"
            placeholder="Oczy, włosy, znaki szczególne..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">
          Statystyki
        </label>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/10">
                {(edition === '2ed' ? stats2ed : stats4ed).map((s) => (
                  <th
                    key={s}
                    className="border border-primary/20 p-2 text-[10px] font-black text-primary"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {(edition === '2ed' ? stats2ed : stats4ed).map((s) => (
                  <td key={s} className="border border-primary/20 p-0">
                    <input
                      type="number"
                      value={stats[s] || 0}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          [s]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-transparent border-none text-center p-2 font-bold text-sm focus:ring-0"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {edition === '2ed' && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/5">
                  {secondaryStats2ed.map((s) => (
                    <th
                      key={s}
                      className="border border-primary/20 p-2 text-[10px] font-black text-primary/60"
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {secondaryStats2ed.map((s) => (
                    <td key={s} className="border border-primary/20 p-0">
                      <input
                        type="number"
                        value={secondaryStats[s] || 0}
                        onChange={(e) =>
                          setSecondaryStats({
                            ...secondaryStats,
                            [s]: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-transparent border-none text-center p-2 font-bold text-sm focus:ring-0"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-primary/20 pb-1">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">
              Umiejętności
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSkills([...skills, ''])}
              className="h-6 text-[10px] text-primary"
            >
              + Dodaj
            </Button>
          </div>

          <div className="space-y-2">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[idx] = e.target.value;
                    setSkills(newSkills);
                  }}
                  className="h-8 text-sm bg-background border-primary/30"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTablePicker({ field: 'skills', index: idx })}
                  className="h-8 w-8 border-primary/30 text-primary"
                >
                  <Dice5 className="w-3 h-3" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                  className="h-8 w-8 text-primary/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-primary/20 pb-1">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">
              Zdolności
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTalents([...talents, ''])}
              className="h-6 text-[10px] text-primary"
            >
              + Dodaj
            </Button>
          </div>

          <div className="space-y-2">
            {talents.map((talent, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={talent}
                  onChange={(e) => {
                    const newTalents = [...talents];
                    newTalents[idx] = e.target.value;
                    setTalents(newTalents);
                  }}
                  className="h-8 text-sm bg-background border-primary/30"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTablePicker({ field: 'talents', index: idx })}
                  className="h-8 w-8 border-primary/30 text-primary"
                >
                  <Dice5 className="w-3 h-3" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setTalents(talents.filter((_, i) => i !== idx))}
                  className="h-8 w-8 text-primary/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-primary/20 pb-1">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">
            Ekwipunek
          </label>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEquipment([...equipment, ''])}
            className="h-6 text-[10px] text-primary"
          >
            + Dodaj Przedmiot
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {equipment.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newEq = [...equipment];
                  newEq[idx] = e.target.value;
                  setEquipment(newEq);
                }}
                className="h-8 text-sm bg-background border-primary/30"
                placeholder="Przedmiot..."
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEquipment(equipment.filter((_, i) => i !== idx))}
                className="h-8 w-8 text-primary/20"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

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