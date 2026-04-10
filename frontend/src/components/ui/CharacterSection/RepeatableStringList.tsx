import { useEffect, useRef, useState } from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { Trash2 } from 'lucide-react';

interface RepeatableStringListProps {
  title: string;
  items: string[];
  setItems: (value: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  columnsClassName?: string;
}

export function RepeatableStringList({
  title,
  items,
  setItems,
  addLabel = '+ Dodaj',
  placeholder = '',
  columnsClassName = 'space-y-2',
}: RepeatableStringListProps) {
  const itemRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [pendingFocus, setPendingFocus] = useState<number | null>(null);

  useEffect(() => {
    if (pendingFocus !== null && itemRefs.current[pendingFocus]) {
      itemRefs.current[pendingFocus]?.focus();
      itemRefs.current[pendingFocus]?.select();
      setPendingFocus(null);
    }
  }, [items, pendingFocus]);

  const addItem = () => {
    const nextIndex = items.length;
    setItems([...items, '']);
    setPendingFocus(nextIndex);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-primary/20 pb-1">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          {title}
        </label>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addItem}
          className="h-6 text-[10px] text-primary"
        >
          {addLabel}
        </Button>
      </div>

      <div className={columnsClassName}>
        {items.map((item, idx) => (
          <div key={`${title}-${idx}`} className="flex gap-2">
            <Input
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                setItems(next);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem();
                }
              }}
              className="bg-background border-primary/30"
              placeholder={placeholder}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(idx)}
              className="h-8 w-8 text-primary/20 hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}