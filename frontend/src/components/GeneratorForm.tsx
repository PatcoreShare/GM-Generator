import { useGeneratorForm } from './ui/hooks/useGeneratorForm';
import { CommonFields } from './ui/sections/CommonFields';
import { TableSection } from './ui/sections/TableSection';
import { NoteSection } from './ui/sections/NoteSection';
import { CharacterSection } from './ui/sections/CharacterSection';

import { Button } from './ui/button';
import {
  Table as TableIcon,
  FileText,
  User as UserIcon,
  Save,
  X,
} from 'lucide-react';

export function GeneratorForm(props) {
  const form = useGeneratorForm(props);

  const {
    type,
    initialData,
    onCancel,
    handleSave,
    showTablePicker,
    setShowTablePicker,
    allTables,
    handleRollFromTable,
  } = form;

  const getTableOptionCount = (table) => {
    if (!table) return 0;

    if (Array.isArray(table.options) && table.options.length > 0) {
      return table.options.length;
    }

    if (Array.isArray(table.variants) && table.variants.length > 0) {
      return table.variants.reduce((sum, variant) => {
        return sum + (Array.isArray(variant.options) ? variant.options.length : 0);
      }, 0);
    }

    if (table.subType === 'complex' && table.multiTables) {
      return Object.values(table.multiTables).reduce((sum, value) => {
        return sum + (Array.isArray(value) ? value.length : 0);
      }, 0);
    }

    return 0;
  };

  return (
    <form
      onSubmit={handleSave}
      className="parchment-card p-8 space-y-6 border-primary/40 shadow-xl"
    >
      <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded">
            {type === 'table' && <TableIcon className="w-6 h-6 text-primary" />}
            {type === 'note' && <FileText className="w-6 h-6 text-primary" />}
            {type === 'character' && <UserIcon className="w-6 h-6 text-primary" />}
          </div>

          <h2 className="text-2xl font-black fancy-heading uppercase tracking-tight text-primary">
            {initialData
              ? 'Edycja Archiwum'
              : `Nowa ${
                  type === 'table'
                    ? 'Tabela'
                    : type === 'note'
                    ? 'Notatka'
                    : 'Postać'
                }`}
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-primary/60 hover:text-primary uppercase text-xs font-bold tracking-widest"
          >
            <X className="w-4 h-4 mr-2" /> Anuluj
          </Button>

          <Button type="submit" className="wfrp-button">
            <Save className="w-4 h-4 mr-2" /> Zapisz w Archiwum
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CommonFields {...form} />

        {type === 'table' && <TableSection {...form} />}
        {type === 'note' && <NoteSection {...form} />}
        {type === 'character' && <CharacterSection {...form} />}
      </div>

      {showTablePicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="parchment-card max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-primary">
            <div className="flex justify-between items-center border-b border-primary/20 pb-2">
              <h3 className="font-black uppercase tracking-widest text-sm text-primary">
                Wybierz Tabelę do Rzutu
              </h3>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowTablePicker(null)}
                className="h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {allTables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() =>
                    handleRollFromTable(
                      table,
                      showTablePicker.field,
                      showTablePicker.index
                    )
                  }
                  className="w-full text-left p-3 rounded border border-primary/10 hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="block font-bold text-xs text-primary group-hover:text-primary">
                      {table.name}
                    </span>
                    <span className="text-[10px] text-primary/40 uppercase font-bold">
                      {getTableOptionCount(table)} pozycji
                    </span>
                  </div>
                </button>
              ))}

              {allTables.length === 0 && (
                <p className="text-center py-4 text-xs text-primary/40 italic">
                  Brak dostępnych tabel.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}