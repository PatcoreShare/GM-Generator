import { CharacterSkillItem } from '../../../../types';
import { Input } from '../input';
import { Trash2 } from 'lucide-react';

interface SkillListSectionProps {
  items: CharacterSkillItem[];
  setItems: (
    value:
      | CharacterSkillItem[]
      | ((prev: CharacterSkillItem[]) => CharacterSkillItem[])
  ) => void;
}

export function SkillListSection({ items, setItems }: SkillListSectionProps) {
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        characteristic: '',
        name: '',
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<CharacterSkillItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const leftItems = items.filter((_, index) => index % 2 === 0);
  const rightItems = items.filter((_, index) => index % 2 === 1);

  const renderSkillCard = (item: CharacterSkillItem) => (
    <div
      key={item.id}
      className="relative rounded border border-primary/10 p-3 bg-background/30"
    >
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label="Usuń umiejętność"
        title="Usuń umiejętność"
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/15 bg-background/80 text-primary/50 transition hover:border-primary/40 hover:text-primary"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-2 pr-8">
        <Input
          value={item.characteristic}
          onChange={(e) =>
            updateItem(item.id, { characteristic: e.target.value })
          }
          placeholder="Cecha, np. Zr"
          className="bg-background border-primary/30"
        />

        <Input
          value={item.name}
          onChange={(e) => updateItem(item.id, { name: e.target.value })}
          placeholder="Nazwa umiejętności..."
          className="bg-background border-primary/30"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary">
          Umiejętności
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
              leftItems.map(renderSkillCard)
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>

          <div className="space-y-3">
            {rightItems.length > 0 ? (
              rightItems.map(renderSkillCard)
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-primary/40">Brak umiejętności.</p>
      )}
    </div>
  );
}