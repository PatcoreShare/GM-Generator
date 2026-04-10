import {
  CharacterArmourItem,
  CharacterEquipmentItem,
  CharacterMeleeWeapon,
  CharacterRangedWeapon,
} from '../../../types';
import { Input } from '../input';
import { Trash2 } from 'lucide-react';

const meleeGroups = [
  'Broń zwykła',
  'Kawaleryjska',
  'Fechtunkowa',
  'Cep',
  'Parująca',
  'Dwuręczna',
  'Tarcza',
];

const rangedGroups = [
  'Łuk',
  'Kusza',
  'Broń prochowa',
  'Broń inżynieryjna',
  'Sieciowa',
  'Proca',
  'Rzutowa',
];

interface CharacterCombatSectionProps {
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
  equipment: CharacterEquipmentItem[];
  setEquipment: (
    value:
      | CharacterEquipmentItem[]
      | ((prev: CharacterEquipmentItem[]) => CharacterEquipmentItem[])
  ) => void;
  encumbrance: {
    current?: number | string;
    max?: number | string;
    notes?: string;
  };
  setEncumbrance: (
    value:
      | { current?: number | string; max?: number | string; notes?: string }
      | ((prev: {
          current?: number | string;
          max?: number | string;
          notes?: string;
        }) => {
          current?: number | string;
          max?: number | string;
          notes?: string;
        })
  ) => void;
}

export function CharacterCombatSection({
  meleeWeapons,
  setMeleeWeapons,
  rangedWeapons,
  setRangedWeapons,
  armour,
  setArmour,
  equipment,
  setEquipment,
  encumbrance,
  setEncumbrance,
}: CharacterCombatSectionProps) {
  const addMeleeWeapon = () => {
    setMeleeWeapons((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        group: '',
        damage: '',
        qualities: '',
        encumbrance: 0,
      },
    ]);
  };

  const updateMeleeWeapon = (
    id: string,
    patch: Partial<CharacterMeleeWeapon>
  ) => {
    setMeleeWeapons((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeMeleeWeapon = (id: string) => {
    setMeleeWeapons((prev) => prev.filter((item) => item.id !== id));
  };

  const addRangedWeapon = () => {
    setRangedWeapons((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        group: '',
        damage: '',
        range: '',
        reload: '',
        ammoType: '',
        qualities: '',
        encumbrance: 0,
      },
    ]);
  };

  const updateRangedWeapon = (
    id: string,
    patch: Partial<CharacterRangedWeapon>
  ) => {
    setRangedWeapons((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeRangedWeapon = (id: string) => {
    setRangedWeapons((prev) => prev.filter((item) => item.id !== id));
  };

  const addArmour = () => {
    setArmour((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        head: '',
        body: '',
        arms: '',
        legs: '',
        specialRules: '',
        encumbrance: 0,
      },
    ]);
  };

  const updateArmour = (id: string, patch: Partial<CharacterArmourItem>) => {
    setArmour((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeArmour = (id: string) => {
    setArmour((prev) => prev.filter((item) => item.id !== id));
  };

  const addEquipment = () => {
    setEquipment((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        quantity: 1,
        encumbrance: 0,
      },
    ]);
  };

  const updateEquipment = (
    id: string,
    patch: Partial<CharacterEquipmentItem>
  ) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id));
  };

  const leftMeleeWeapons = meleeWeapons.filter((_, index) => index % 2 === 0);
  const rightMeleeWeapons = meleeWeapons.filter((_, index) => index % 2 === 1);

  const leftRangedWeapons = rangedWeapons.filter((_, index) => index % 2 === 0);
  const rightRangedWeapons = rangedWeapons.filter((_, index) => index % 2 === 1);

  const leftArmour = armour.filter((_, index) => index % 2 === 0);
  const rightArmour = armour.filter((_, index) => index % 2 === 1);

  const leftEquipment = equipment.filter((_, index) => index % 2 === 0);
  const rightEquipment = equipment.filter((_, index) => index % 2 === 1);

  const renderIconRemoveButton = (onClick: () => void, label: string) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-background/80 text-primary/50 transition hover:border-primary/40 hover:text-primary"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );

  const renderMeleeCard = (item: CharacterMeleeWeapon) => (
    <div
      key={item.id}
      className="relative rounded border border-primary/10 p-3 bg-background/30 space-y-2"
    >
      {renderIconRemoveButton(
        () => removeMeleeWeapon(item.id),
        'Usuń broń białą'
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-8">
        <Input
          value={item.name}
          onChange={(e) =>
            updateMeleeWeapon(item.id, { name: e.target.value })
          }
          placeholder="Nazwa broni..."
          className="bg-background border-primary/30"
        />

        <div>
          <input
            list={`melee-groups-${item.id}`}
            value={item.group || ''}
            onChange={(e) =>
              updateMeleeWeapon(item.id, { group: e.target.value })
            }
            placeholder="Kategoria..."
            className="w-full bg-background border border-primary/30 rounded px-3 py-2 text-sm"
          />
          <datalist id={`melee-groups-${item.id}`}>
            {meleeGroups.map((group) => (
              <option key={group} value={group} />
            ))}
          </datalist>
        </div>

        <Input
          value={item.damage || ''}
          onChange={(e) =>
            updateMeleeWeapon(item.id, { damage: e.target.value })
          }
          placeholder="Siła broni, np. S-1, S+2"
          className="bg-background border-primary/30"
        />

        <Input
          type="number"
          value={item.encumbrance ?? 0}
          onChange={(e) =>
            updateMeleeWeapon(item.id, {
              encumbrance: e.target.value,
            })
          }
          placeholder="Obciążenie"
          className="bg-background border-primary/30"
        />
      </div>

      <textarea
        value={item.qualities || ''}
        onChange={(e) =>
          updateMeleeWeapon(item.id, { qualities: e.target.value })
        }
        className="w-full h-20 bg-background border border-primary/30 rounded px-3 py-2 text-sm focus:outline-none"
        placeholder="Cechy oręża, oddzielone przecinkami..."
      />
    </div>
  );

  const renderRangedCard = (item: CharacterRangedWeapon) => (
    <div
      key={item.id}
      className="relative rounded border border-primary/10 p-3 bg-background/30 space-y-2"
    >
      {renderIconRemoveButton(
        () => removeRangedWeapon(item.id),
        'Usuń broń zasięgową'
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-8">
        <Input
          value={item.name}
          onChange={(e) =>
            updateRangedWeapon(item.id, { name: e.target.value })
          }
          placeholder="Nazwa broni..."
          className="bg-background border-primary/30"
        />

        <div>
          <input
            list={`ranged-groups-${item.id}`}
            value={item.group || ''}
            onChange={(e) =>
              updateRangedWeapon(item.id, { group: e.target.value })
            }
            placeholder="Kategoria..."
            className="w-full bg-background border border-primary/30 rounded px-3 py-2 text-sm"
          />
          <datalist id={`ranged-groups-${item.id}`}>
            {rangedGroups.map((group) => (
              <option key={group} value={group} />
            ))}
          </datalist>
        </div>

        <Input
          value={item.damage || ''}
          onChange={(e) =>
            updateRangedWeapon(item.id, { damage: e.target.value })
          }
          placeholder="Siła broni, np. SB+3"
          className="bg-background border-primary/30"
        />

        <Input
          value={item.range || ''}
          onChange={(e) =>
            updateRangedWeapon(item.id, { range: e.target.value })
          }
          placeholder="Zasięg, np. 16/32"
          className="bg-background border-primary/30"
        />

        <Input
          value={item.reload || ''}
          onChange={(e) =>
            updateRangedWeapon(item.id, { reload: e.target.value })
          }
          placeholder="Przeładowanie"
          className="bg-background border-primary/30"
        />

        <Input
          value={item.ammoType || ''}
          onChange={(e) =>
            updateRangedWeapon(item.id, { ammoType: e.target.value })
          }
          placeholder="Amunicja"
          className="bg-background border-primary/30"
        />

        <Input
          type="number"
          value={item.encumbrance ?? 0}
          onChange={(e) =>
            updateRangedWeapon(item.id, {
              encumbrance: e.target.value,
            })
          }
          placeholder="Obciążenie"
          className="bg-background border-primary/30"
        />
      </div>

      <textarea
        value={item.qualities || ''}
        onChange={(e) =>
          updateRangedWeapon(item.id, { qualities: e.target.value })
        }
        className="w-full h-20 bg-background border border-primary/30 rounded px-3 py-2 text-sm focus:outline-none"
        placeholder="Cechy oręża, oddzielone przecinkami..."
      />
    </div>
  );

  const renderArmourCard = (item: CharacterArmourItem) => (
    <div
      key={item.id}
      className="relative rounded border border-primary/10 p-3 bg-background/30 space-y-2"
    >
      {renderIconRemoveButton(() => removeArmour(item.id), 'Usuń pancerz')}

      <div className="pr-8">
        <Input
          value={item.name}
          onChange={(e) =>
            updateArmour(item.id, { name: e.target.value })
          }
          placeholder="Nazwa pancerza..."
          className="bg-background border-primary/30"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Input
          type="number"
          value={item.head ?? ''}
          onChange={(e) => updateArmour(item.id, { head: e.target.value })}
          placeholder="Głowa"
          className="bg-background border-primary/30"
        />
        <Input
          type="number"
          value={item.body ?? ''}
          onChange={(e) => updateArmour(item.id, { body: e.target.value })}
          placeholder="Korpus"
          className="bg-background border-primary/30"
        />
        <Input
          type="number"
          value={item.arms ?? ''}
          onChange={(e) => updateArmour(item.id, { arms: e.target.value })}
          placeholder="Ręce"
          className="bg-background border-primary/30"
        />
        <Input
          type="number"
          value={item.legs ?? ''}
          onChange={(e) => updateArmour(item.id, { legs: e.target.value })}
          placeholder="Nogi"
          className="bg-background border-primary/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          value={item.specialRules || ''}
          onChange={(e) =>
            updateArmour(item.id, { specialRules: e.target.value })
          }
          placeholder="Zasady specjalne"
          className="bg-background border-primary/30"
        />

        <Input
          type="number"
          value={item.encumbrance ?? 0}
          onChange={(e) =>
            updateArmour(item.id, { encumbrance: e.target.value })
          }
          placeholder="Obciążenie"
          className="bg-background border-primary/30"
        />
      </div>
    </div>
  );

  const renderEquipmentCard = (item: CharacterEquipmentItem) => (
    <div
      key={item.id}
      className="relative rounded border border-primary/10 p-3 bg-background/30 space-y-2"
    >
      {renderIconRemoveButton(
        () => removeEquipment(item.id),
        'Usuń przedmiot'
      )}

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_120px_120px] gap-2 pr-8">
        <Input
          value={item.name}
          onChange={(e) =>
            updateEquipment(item.id, { name: e.target.value })
          }
          placeholder="Nazwa przedmiotu..."
          className="bg-background border-primary/30"
        />

        <Input
          type="number"
          value={item.quantity ?? 1}
          onChange={(e) =>
            updateEquipment(item.id, { quantity: e.target.value })
          }
          placeholder="Ilość"
          className="bg-background border-primary/30"
        />

        <Input
          type="number"
          value={item.encumbrance ?? 0}
          onChange={(e) =>
            updateEquipment(item.id, { encumbrance: e.target.value })
          }
          placeholder="Obciążenie"
          className="bg-background border-primary/30"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">
            Broń Biała
          </h4>
          <button
            type="button"
            onClick={addMeleeWeapon}
            className="text-xs font-bold text-primary/70 hover:text-primary"
          >
            + Dodaj
          </button>
        </div>

        {meleeWeapons.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {leftMeleeWeapons.length > 0 ? (
                leftMeleeWeapons.map(renderMeleeCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            <div className="space-y-3">
              {rightMeleeWeapons.length > 0 ? (
                rightMeleeWeapons.map(renderMeleeCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-primary/40">Brak broni białej.</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">
            Broń Zasięgowa
          </h4>
          <button
            type="button"
            onClick={addRangedWeapon}
            className="text-xs font-bold text-primary/70 hover:text-primary"
          >
            + Dodaj
          </button>
        </div>

        {rangedWeapons.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {leftRangedWeapons.length > 0 ? (
                leftRangedWeapons.map(renderRangedCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            <div className="space-y-3">
              {rightRangedWeapons.length > 0 ? (
                rightRangedWeapons.map(renderRangedCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-primary/40">Brak broni zasięgowej.</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">
            Pancerz
          </h4>
          <button
            type="button"
            onClick={addArmour}
            className="text-xs font-bold text-primary/70 hover:text-primary"
          >
            + Dodaj
          </button>
        </div>

        {armour.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {leftArmour.length > 0 ? (
                leftArmour.map(renderArmourCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            <div className="space-y-3">
              {rightArmour.length > 0 ? (
                rightArmour.map(renderArmourCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-primary/40">Brak pancerza.</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">
            Ekwipunek
          </h4>
          <button
            type="button"
            onClick={addEquipment}
            className="text-xs font-bold text-primary/70 hover:text-primary"
          >
            + Dodaj
          </button>
        </div>

        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {leftEquipment.length > 0 ? (
                leftEquipment.map(renderEquipmentCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>

            <div className="space-y-3">
              {rightEquipment.length > 0 ? (
                rightEquipment.map(renderEquipmentCard)
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-primary/40">Brak ekwipunku.</p>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
          Obciążenie
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-background/30 p-3 rounded border border-primary/10 text-center">
            <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
              Aktualne
            </span>
            <span className="font-bold text-primary">
              {encumbrance?.current ?? 0}
            </span>
          </div>

          <div className="bg-background/30 p-3 rounded border border-primary/10 text-center">
            <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
              Maksymalne
            </span>
            <Input
              type="number"
              value={encumbrance?.max ?? ''}
              onChange={(e) =>
                setEncumbrance((prev) => ({
                  ...prev,
                  max: e.target.value,
                }))
              }
              placeholder="np. 8"
              className="bg-transparent border-primary/20 text-center"
            />
          </div>

          <div className="bg-background/30 p-3 rounded border border-primary/10 text-center">
            <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
              Notatka
            </span>
            <Input
              value={encumbrance?.notes ?? ''}
              onChange={(e) =>
                setEncumbrance((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="np. plecak, sakwy"
              className="bg-transparent border-primary/20 text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}