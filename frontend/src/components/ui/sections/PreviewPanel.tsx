import { Card, CardContent } from '../card';
import { Button } from '../button';
import {
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  Skull,
  CopyPlus,
  Dice5,
} from 'lucide-react';
import { CharacterArchive, NoteArchive, RandomTable } from '../../../types';
import { ResultHistory } from './ResultHistory';

interface PreviewPanelProps {
  previewItem: any;
  currentUser: any;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  handleClone: (item: any) => void;
  results: any[];
  setResults: (value: any) => void;
  copied: boolean;
  copyToClipboard: () => void;
  rollCount: number;
  setRollCount: (value: number) => void;
  activeVariants: Record<string, string[]>;
  toggleVariant: (tableId: string, variantId: string) => void;
  handleRoll: (table: RandomTable) => void;
  lastRollCount: number;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (value: boolean) => void;
}

export function PreviewPanel({
  previewItem,
  currentUser,
  onEdit,
  onDelete,
  handleClone,
  results,
  setResults,
  copied,
  copyToClipboard,
  rollCount,
  setRollCount,
  activeVariants,
  toggleVariant,
  handleRoll,
  lastRollCount,
  isHistoryExpanded,
  setIsHistoryExpanded,
}: PreviewPanelProps) {
  return (
    <div className="xl:col-span-3">
      <Card className="parchment-card border-primary bg-primary/5 flex flex-col">
        <CardContent className="pt-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
            <div className="flex items-center gap-3">
              <h3 className="fancy-heading text-lg font-bold uppercase tracking-tight">
                {previewItem ? previewItem.name : 'Podgląd Archiwum'}
              </h3>

              {previewItem && (
                <div className="flex gap-1">
                  {(previewItem.ownerId === currentUser.id || currentUser.role === 'admin') && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(previewItem)}
                        className="h-7 w-7 text-primary/40 hover:text-primary"
                        title="Edytuj"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(previewItem.id)}
                        className="h-7 w-7 text-primary/20 hover:text-destructive"
                        title="Usuń"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}

                  {previewItem.ownerId !== currentUser.id && previewItem.isBuiltIn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleClone(previewItem)}
                      className="h-7 w-7 text-primary/40 hover:text-primary"
                      title="Skopiuj do swoich"
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {results.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-primary/60 hover:text-primary"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? 'Skopiowano' : 'Kopiuj Wszystko'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setResults([])}
                    className="h-8 w-8 text-primary/40 hover:text-destructive"
                    title="Wyczyść"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {!previewItem ? (
            <div className="flex flex-col items-center justify-center h-80 text-primary/30 italic text-center px-4">
              <Skull className="w-16 h-16 mb-6 opacity-10" />
              <p className="text-sm">
                Wybierz wpis z lewej, aby zobaczyć szczegóły lub wykonać rzut.
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              {previewItem.type === 'table' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="flex items-center gap-4 bg-background/50 p-3 rounded border border-primary/10 max-w-[150px]">
                      <label className="text-[10px] font-black uppercase text-primary/40 whitespace-nowrap">
                        Rzuty:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={rollCount}
                        onChange={(e) =>
                          setRollCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
                        }
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-transparent border-none text-right font-bold text-primary focus:ring-0 text-base"
                      />
                    </div>

                    {previewItem.variants && previewItem.variants.length > 0 && (
                      <div className="flex-1 min-w-[200px] space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                          Warianty tabeli
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {previewItem.variants.map((v) => (
                            <label
                              key={v.id}
                              className="flex items-center gap-2 bg-background border border-primary/20 px-2 py-1 rounded cursor-pointer hover:bg-primary/5 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={(activeVariants[previewItem.id] || []).includes(v.id)}
                                onChange={() => toggleVariant(previewItem.id, v.id)}
                                className="accent-primary w-3 h-3"
                              />
                              <span className="text-[10px] font-bold uppercase">{v.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewItem.subType === 'complex' && previewItem.fields && (
                      <div className="flex-1 min-w-[200px] space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                          Aktywne pola
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {previewItem.fields.map((f) => (
                            <label
                              key={f.source}
                              className="flex items-center gap-2 bg-background border border-primary/20 px-2 py-1 rounded cursor-pointer hover:bg-primary/5 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  activeVariants[previewItem.id] ||
                                  previewItem.fields?.map((field) => field.source)
                                ).includes(f.source)}
                                onChange={() => toggleVariant(previewItem.id, f.source)}
                                className="accent-primary w-3 h-3"
                              />
                              <span className="text-[10px] font-bold uppercase">{f.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleRoll(previewItem as RandomTable)}
                      className="wfrp-button h-[46px] px-6"
                    >
                      <Dice5 className="w-4 h-4 mr-2" /> Losuj
                    </Button>
                  </div>

                  <ResultHistory
                    results={results}
                    lastRollCount={lastRollCount}
                    isHistoryExpanded={isHistoryExpanded}
                    setIsHistoryExpanded={setIsHistoryExpanded}
                  />
                </div>
              )}

              {previewItem.type === 'note' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-4">
                    {(previewItem as NoteArchive).blocks.map((block) => (
                      <div key={block.id}>
                        {block.type === 'text' ? (
                          <p className="font-serif italic text-xl text-primary leading-relaxed whitespace-pre-wrap">
                            {block.content}
                          </p>
                        ) : (
                          <div className="flex justify-center py-4">
                            <img
                              src={block.content}
                              alt="Obraz w notatce"
                              style={{ width: block.width || '100%' }}
                              className="rounded shadow-lg border-4 border-double border-primary/20"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewItem.type === 'character' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-primary/5 p-6 rounded border border-primary/10">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
                        Rasa
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {(previewItem as CharacterArchive).race}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
                        Profesja
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {(previewItem as CharacterArchive).profession}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">
                        System
                      </span>
                      <span className="text-lg font-bold text-primary">
                        Warhammer {(previewItem as CharacterArchive).edition}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
                      Statystyki Główne
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-primary/10">
                            {Object.keys((previewItem as CharacterArchive).stats).map((s) => (
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
                            {Object.values((previewItem as CharacterArchive).stats).map((val, i) => (
                              <td
                                key={i}
                                className="border border-primary/20 p-2 text-center font-bold text-primary"
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {(previewItem as CharacterArchive).secondaryStats && (
                      <>
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 mt-6">
                          Statystyki Poboczne
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-primary/5">
                                {Object.keys((previewItem as CharacterArchive).secondaryStats!).map((s) => (
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
                                {Object.values((previewItem as CharacterArchive).secondaryStats!).map((val, i) => (
                                  <td
                                    key={i}
                                    className="border border-primary/20 p-2 text-center font-bold text-primary/80"
                                  >
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
                        Umiejętności
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(previewItem as CharacterArchive).skills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-xs font-bold text-primary/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
                        Zdolności
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(previewItem as CharacterArchive).talents.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-xs font-bold text-primary/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
                      Ekwipunek
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(previewItem as CharacterArchive).equipment.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-background/30 p-2 rounded border border-primary/10 text-sm flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">
                      Notatki
                    </h4>
                    <p className="font-serif italic text-primary/80 whitespace-pre-wrap">
                      {(previewItem as CharacterArchive).notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}