import { CharacterTalentItem } from '../../../../types';
import { Input } from '../input';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface TalentListSectionProps {
  items: CharacterTalentItem[];
  setItems: (
    value:
      | CharacterTalentItem[]
      | ((prev: CharacterTalentItem[]) => CharacterTalentItem[])
  ) => void;
}

export function TalentListSection({ items, setItems }: TalentListSectionProps) {
  const [openDescriptions, setOpenDescriptions] = useState<Record<string, boolean>>({});

  const addItem = () => {
    const id = crypto.randomUUID();
    setItems((prev) => [
      ...prev,
      {
        id,
        name: '',
        description: '',
      },
    ]);
    setOpenDescriptions((prev) => ({ ...prev, [id]: false }));
  };

  const updateItem = (id: string, patch: Partial<CharacterTalentItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setOpenDescriptions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleDescription = (id: string) => {
    setOpenDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const leftItems = items.filter((_, index) => index % 2 === 0);
  const rightItems = items.filter((_, index) => index % 2 === 1);

  const renderTalentCard = (item: CharacterTalentItem) => {
    const isOpen = openDescriptions[item.id] ?? false;

    return (
      <div
        key={item.id}
        className="relative rounded border border-primary/10 p-3 bg-background/30 space-y-3"
      >
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label="Usuń zdolność"
          title="Usuń zdolność"
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-background/80 text-primary/50 transition hover:border-primary/40 hover:text-primary"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_130px] gap-2 pr-8">
          <Input
            value={item.name}
            onChange={(e) => updateItem(item.id, { name: e.target.value })}
            placeholder="Nazwa zdolności..."
            className="bg-background border-primary/30"
          />

          <button
            type="button"
            onClick={() => toggleDescription(item.id)}
            className="h-10 rounded border border-primary/20 px-3 text-xs font-bold text-primary/70 hover:text-primary hover:border-primary/40"
          >
            {isOpen ? 'Ukryj opis' : 'Pokaż opis'}
          </button>
        </div>

        {isOpen && (
          <textarea
            value={item.description || ''}
            onChange={(e) =>
              updateItem(item.id, { description: e.target.value })
            }
            className="w-full h-24 bg-background border border-primary/30 rounded px-3 py-2 text-sm focus:outline-none"
            placeholder="Opis zdolności... (opcjonalny)"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary">
          Zdolności
        </h4>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-bold text-primary/70 hover:text-primary"
        >
          + Dodaj
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {leftItems.length > 0 ? (
              leftItems.map(renderTalentCard)
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>

          <div className="space-y-3">
            {rightItems.length > 0 ? (
              rightItems.map(renderTalentCard)
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">Brak zdolności.</p>
      )}
    </div>
  );
}