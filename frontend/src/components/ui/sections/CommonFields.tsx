import { Input } from '../input';
import { Button } from '../button';
import { Dice5 } from 'lucide-react';

export function CommonFields({
  type,
  name,
  setName,
  tags,
  setTags,
  isBuiltIn,
  setIsBuiltIn,
  currentUser,
  setShowTablePicker,
}) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Nazwa / Imię
        </label>

        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wpisz nazwę..."
            className="bg-background border-primary/30 font-bold"
          />

          {type === 'character' && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowTablePicker({ field: 'name' })}
              className="border-primary/30 text-primary"
            >
              <Dice5 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Tagi (oddzielone przecinkami)
        </label>

        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="np. Walka, Miasto, Karczma"
          className="bg-background border-primary/30"
        />
      </div>

      {currentUser?.role === 'admin' && (
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 rounded border border-primary/20 bg-primary/5 px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isBuiltIn}
              onChange={(e) => setIsBuiltIn(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary"
            />

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                Udostępnij wszystkim
              </div>
              <div className="text-xs text-primary/60">
                Ten generator będzie widoczny dla wszystkich użytkowników jako wpis wbudowany.
              </div>
            </div>
          </label>
        </div>
      )}
    </>
  );
}