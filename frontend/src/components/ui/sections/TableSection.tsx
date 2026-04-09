import { Input } from '../input';
import { Button } from '../button';
import { Plus, Trash2, Table as TableIcon } from 'lucide-react';

export function TableSection({
  description,
  setDescription,
  subType,
  setSubType,

  options,
  fields,
  multiTables,

  addOption,
  addComplexField,
  addOptionToMultiTable,

  updateOption,
  removeOption,

  updateField,
  renameFieldSource,
  removeField,

  updateMultiTableOption,
  removeMultiTableOption,

  allTables,
  setShowTablePicker,
  handleKeyDown,
  lastInputRef,
  lastMultiInputRef,
}) {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-widest text-primary">
          Opis
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opcjonalny opis..."
          className="bg-background border-primary/30"
        />
      </div>

      <div className="md:col-span-2 flex gap-4 bg-primary/5 p-4 rounded border border-primary/10">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={subType === 'simple'}
            onChange={() => setSubType('simple')}
            className="accent-primary"
          />
          <span className="text-sm font-bold">Tabela Prosta</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={subType === 'complex'}
            onChange={() => setSubType('complex')}
            className="accent-primary"
          />
          <span className="text-sm font-bold">Tabela Złożona (Wiele Pól)</span>
        </label>
      </div>

      {subType === 'simple' ? (
        <div className="space-y-4 pt-4 md:col-span-2">
          <div className="flex justify-between items-center border-b border-primary/20 pb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">
              Opcje Główne
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="h-8 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="w-3 h-3 mr-2" /> Dodaj Pozycję
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex gap-2 items-start">
                {option.nestedTableId ? (
                  <div className="flex-1 flex gap-2 items-center bg-primary/5 border border-primary/30 rounded px-3 h-10">
                    <TableIcon className="w-4 h-4 text-primary/60" />

                    <span className="text-xs font-bold text-primary flex-1 truncate">
                      {allTables.find((t) => t.id === option.nestedTableId)?.name || 'Nieznana Tabela'}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateOption(option.id, {
                          nestedTableId: undefined,
                        })
                      }
                      className="h-6 text-[10px] uppercase font-bold text-destructive hover:bg-destructive/10"
                    >
                      Zmień na tekst
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOption(option.id, {
                          text: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, addOption)}
                      placeholder="Tekst wyniku..."
                      className="bg-background border-primary/30"
                      ref={index === options.length - 1 ? lastInputRef : null}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setShowTablePicker({
                          field: 'nestedTable',
                          optionId: option.id,
                        })
                      }
                      className="h-10 w-10 border-primary/30 text-primary/40 hover:text-primary hover:bg-primary/10"
                      title="Zmień na tabelę"
                    >
                      <TableIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Input
                  type="number"
                  value={option.weight}
                  onChange={(e) =>
                    updateOption(option.id, {
                      weight: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20 bg-background border-primary/30 text-center"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(option.id)}
                  className="text-primary/20 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 pt-4 md:col-span-2">
          <div className="flex justify-between items-center border-b border-primary/20 pb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-primary">
              Pola Generatora
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addComplexField}
                className="h-8 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="w-3 h-3 mr-2" /> Dodaj Pole
              </Button>
            </div>
          </div>

          {fields.map((field, fIdx) => (
            <div
              key={field.source || fIdx}
              className="p-4 border border-primary/20 rounded bg-primary/5 space-y-4"
            >
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-primary/60">
                    Etykieta Pola
                  </label>
                  <Input
                    value={field.label}
                    onChange={(e) =>
                      updateField(fIdx, {
                        label: e.target.value,
                      })
                    }
                    className="bg-background border-primary/30 font-bold"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-primary/60">
                    Źródło (Klucz Tabeli)
                  </label>
                  <Input
                    value={field.source}
                    onChange={(e) => renameFieldSource(fIdx, e.target.value)}
                    className="bg-background border-primary/30 font-mono text-xs"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(fIdx)}
                  className="mt-5 text-destructive/60"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-primary/40">
                    Tabela dla: {field.source}
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addOptionToMultiTable(field.source)}
                    className="h-6 text-[10px] text-primary"
                  >
                    + Dodaj Pozycję
                  </Button>
                </div>

                {(multiTables[field.source] || []).map((opt, oIdx, arr) => (
                  <div key={opt.id} className="flex gap-2">
                    {opt.nestedTableId ? (
                      <div className="flex-1 flex gap-2 items-center bg-primary/5 border border-primary/30 rounded px-2 h-8">
                        <TableIcon className="w-3 h-3 text-primary/60" />

                        <span className="text-[10px] font-bold text-primary flex-1 truncate">
                          {allTables.find((t) => t.id === opt.nestedTableId)?.name || 'Nieznana Tabela'}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateMultiTableOption(field.source, opt.id, {
                              nestedTableId: undefined,
                            })
                          }
                          className="h-5 px-1 text-[8px] uppercase font-bold text-destructive hover:bg-destructive/10"
                        >
                          Tekst
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={opt.text}
                          onChange={(e) =>
                            updateMultiTableOption(field.source, opt.id, {
                              text: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => addOptionToMultiTable(field.source))
                          }
                          className="bg-background border-primary/30 h-8 text-xs"
                          ref={oIdx === arr.length - 1 ? (el) => {
                            lastMultiInputRef.current[field.source] = el;
                          } : null}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setShowTablePicker({
                              field: 'nestedTable',
                              optionId: opt.id,
                              source: field.source,
                            })
                          }
                          className="h-8 w-8 border-primary/30 text-primary/40 hover:text-primary hover:bg-primary/10"
                          title="Zmień na tabelę"
                        >
                          <TableIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <Input
                      type="number"
                      value={opt.weight}
                      onChange={(e) =>
                        updateMultiTableOption(field.source, opt.id, {
                          weight: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-16 bg-background border-primary/30 h-8 text-xs text-center"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMultiTableOption(field.source, opt.id)}
                      className="h-8 w-8 text-primary/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}