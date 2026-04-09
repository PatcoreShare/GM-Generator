import React, { useState } from 'react';
import { ArchiveItem, RandomTable, NoteArchive, CharacterArchive, User, TableOption } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Edit, Copy, Check, X, Skull, User as UserIcon, CopyPlus, FileText, Users, Table as TableIcon, Dice5, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratorListProps {
  generators: ArchiveItem[];
  allTables: RandomTable[];
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  currentUser: User;
}

export function GeneratorList({ generators, allTables, onEdit, onDelete, currentUser }: GeneratorListProps) {
  const [results, setResults] = useState<any[]>([]);
  const [rollCount, setRollCount] = useState(1);
  const [lastRollCount, setLastRollCount] = useState(0);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeVariants, setActiveVariants] = useState<Record<string, string[]>>({});
  const [previewItem, setPreviewItem] = useState<ArchiveItem | null>(null);

  const formatResultForClipboard = (res: any, indent = 0): string => {
    const space = '  '.repeat(indent);
    if (typeof res === 'string') return res;
    if (res.type === 'note') return `${space}Notatka: ${res.name}\n${space}${res.content}`;
    if (res.type === 'character') return `${space}Postać: ${res.name}\n${space}${res.race} • ${res.profession}`;
    if (res.text !== undefined && res.nested !== undefined) {
      return `${res.text}\n${formatResultForClipboard(res.nested, indent + 1)}`;
    }
    return Object.entries(res)
      .map(([k, v]) => `${space}${k}: ${formatResultForClipboard(v, indent + 1)}`)
      .join('\n');
  };

  const ResultRenderer = ({ data, isNested = false }: { data: any, isNested?: boolean }) => {
    if (typeof data === 'string') {
      return <span className={`${isNested ? 'text-sm' : 'text-base'} text-primary font-serif italic whitespace-pre-wrap`}>{data}</span>;
    }

    if (data.type === 'note') {
      return (
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black text-primary/40 block">Notatka: {data.name}</span>
          <p className="text-sm line-clamp-3">{data.content}</p>
        </div>
      );
    }

    if (data.type === 'character') {
      return (
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black text-primary/40 block">Postać: {data.name}</span>
          <p className="text-sm">{data.race} • {data.profession}</p>
        </div>
      );
    }

    if (data.text !== undefined && data.nested !== undefined) {
      return (
        <div className="space-y-1">
          {data.text && <div className="text-primary font-serif italic text-base">{data.text}</div>}
          <div className="pl-4 border-l-2 border-primary/10">
            <ResultRenderer data={data.nested} isNested={true} />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 not-italic font-sans">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="flex flex-col border-l-2 border-primary/20 pl-3">
            <span className="text-[10px] uppercase font-black text-primary/40 tracking-tighter leading-none mb-1">{label}</span>
            <ResultRenderer data={value} isNested={true} />
          </div>
        ))}
      </div>
    );
  };

  const performRoll = (table: RandomTable, selectedVariantIds: string[]): any => {
    if (table.subType === 'complex' && table.fields && table.multiTables) {
      const result: Record<string, any> = {};
      const activeFields = activeVariants[table.id] || table.fields.map(f => f.source);

      table.fields.forEach(field => {
        if (!activeFields.includes(field.source)) return;

        const options = table.multiTables![field.source] || [];
        if (options.length === 0) {
          result[field.label] = "Brak danych";
          return;
        }
        const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
        let random = Math.random() * totalWeight;
        for (const option of options) {
          random -= option.weight;
          if (random <= 0) {
            if (option.nestedTableId) {
              const nestedTable = allTables.find(t => t.id === option.nestedTableId);
              if (nestedTable) {
                const nestedRes = performRoll(nestedTable, []);
                result[field.label] = { text: option.text, nested: nestedRes };
                break;
              }
            }
            result[field.label] = option.text;
            break;
          }
        }
      });
      return result;
    }

    let optionsToUse: TableOption[] = [...table.options];
    
    if (selectedVariantIds.length > 0) {
      selectedVariantIds.forEach(vId => {
        const variant = table.variants?.find(v => v.id === vId);
        if (variant) {
          optionsToUse.push(...variant.options);
        }
      });
    }

    const totalWeight = optionsToUse.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const option of optionsToUse) {
      random -= option.weight;
      if (random <= 0) {
        if (option.nestedTableId) {
          const nestedTable = allTables.find(t => t.id === option.nestedTableId);
          if (nestedTable) {
            const nestedRes = performRoll(nestedTable, []);
            return { text: option.text, nested: nestedRes };
          }
        }
        return option.text;
      }
    }
    return optionsToUse[0]?.text || "Błąd rzutu";
  };

  const handleRoll = (table: RandomTable) => {
    const newResults = [];
    const selectedVariants = activeVariants[table.id] || [];
    for (let i = 0; i < rollCount; i++) {
      newResults.push(performRoll(table, selectedVariants));
    }
    setResults(prev => [...newResults, ...prev].slice(0, 50));
    setLastRollCount(rollCount);
    setIsHistoryExpanded(false);
    setPreviewItem(table);
  };

  const handleClone = (item: ArchiveItem) => {
    const cloned = {
      ...item,
      id: crypto.randomUUID(),
      ownerId: currentUser.id,
      ownerName: currentUser.username,
      isBuiltIn: false,
      tags: item.tags?.filter(t => t !== 'Wbudowane') || [],
      createdAt: new Date().toISOString()
    };
    onEdit(cloned as ArchiveItem);
    toast.info("Skopiowano do Twojego archiwum. Możesz teraz edytować.");
  };

  const copyToClipboard = () => {
    const text = results.map(res => formatResultForClipboard(res)).join('\n---\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Skopiowano wyniki do schowka");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVariant = (tableId: string, variantId: string) => {
    const current = activeVariants[tableId] || [];
    if (current.includes(variantId)) {
      setActiveVariants({ ...activeVariants, [tableId]: current.filter(id => id !== variantId) });
    } else {
      setActiveVariants({ ...activeVariants, [tableId]: [...current, variantId] });
    }
  };

  if (generators.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
        <p className="text-primary/60 italic">Archiwa są puste. Spisz nową treść, aby zacząć.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
      <div className="xl:col-span-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {generators.map((item) => {
            const isOwner = item.ownerId === currentUser.id;
            const isAdmin = currentUser.role === 'admin';
            const canEdit = isOwner || isAdmin;

            return (
              <div 
                key={item.id} 
                className={`parchment-card group relative aspect-[5/3] flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:bg-primary/5 select-none overflow-hidden ${previewItem?.id === item.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                onClick={() => {
                  setPreviewItem(item);
                  if (item.type === 'table') {
                    handleRoll(item);
                  } else if (item.type === 'note') {
                    setResults(prev => [{ type: 'note', name: item.name, content: item.blocks[0]?.content || '' }, ...prev].slice(0, 50));
                    setLastRollCount(1);
                  } else if (item.type === 'character') {
                    setResults(prev => [{ type: 'character', name: item.name, race: item.race, profession: item.profession }, ...prev].slice(0, 50));
                    setLastRollCount(1);
                  }
                }}
              >
                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {canEdit && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }} 
                        className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 shadow-sm"
                        title="Edytuj"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                        className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/20 hover:text-destructive hover:bg-destructive/10 shadow-sm"
                        title="Usuń"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  {!isOwner && item.isBuiltIn && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleClone(item); }} 
                      className="h-6 w-6 bg-background/90 border border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/10 shadow-sm"
                      title="Skopiuj do swoich"
                    >
                      <CopyPlus className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="bg-primary/10 p-1 rounded-full mb-1 group-hover:bg-primary/20 transition-colors">
                  {item.type === 'table' && <TableIcon className="w-3 h-3 text-primary" />}
                  {item.type === 'note' && <FileText className="w-3 h-3 text-primary" />}
                  {item.type === 'character' && <Users className="w-3 h-3 text-primary" />}
                </div>
                
                <h3 className="font-bold text-primary text-[10px] leading-tight mb-0.5 line-clamp-2 px-1 uppercase tracking-tighter">{item.name}</h3>
                
                {item.type === 'table' && activeVariants[item.id]?.length > 0 && (
                  <div className="text-[8px] text-primary/40 font-bold uppercase mt-1">
                    +{activeVariants[item.id].length} warianty
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-1 text-[8px] text-primary/40 font-bold uppercase mt-1">
                    <UserIcon className="w-2 h-2" />
                    {item.ownerName || 'Nieznany'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
                        <Button variant="ghost" size="icon" onClick={() => onEdit(previewItem)} className="h-7 w-7 text-primary/40 hover:text-primary" title="Edytuj">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(previewItem.id)} className="h-7 w-7 text-primary/20 hover:text-destructive" title="Usuń">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    {previewItem.ownerId !== currentUser.id && previewItem.isBuiltIn && (
                      <Button variant="ghost" size="icon" onClick={() => handleClone(previewItem)} className="h-7 w-7 text-primary/40 hover:text-primary" title="Skopiuj do swoich">
                        <CopyPlus className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {results.length > 0 && (
                  <>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-primary/60 hover:text-primary">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Skopiowano" : "Kopiuj Wszystko"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setResults([])} className="h-8 w-8 text-primary/40 hover:text-destructive" title="Wyczyść">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {!previewItem ? (
              <div className="flex flex-col items-center justify-center h-80 text-primary/30 italic text-center px-4">
                <Skull className="w-16 h-16 mb-6 opacity-10" />
                <p className="text-sm">Wybierz wpis z lewej, aby zobaczyć szczegóły lub wykonać rzut.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-6">
                {previewItem.type === 'table' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-end gap-4">
                      <div className="flex items-center gap-4 bg-background/50 p-3 rounded border border-primary/10 max-w-[150px]">
                        <label className="text-[10px] font-black uppercase text-primary/40 whitespace-nowrap">Rzuty:</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="20" 
                          value={rollCount} 
                          onChange={(e) => setRollCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent border-none text-right font-bold text-primary focus:ring-0 text-base"
                        />
                      </div>

                      {previewItem.variants && previewItem.variants.length > 0 && (
                        <div className="flex-1 min-w-[200px] space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Warianty tabeli</label>
                          <div className="flex flex-wrap gap-2">
                            {previewItem.variants.map(v => (
                              <label key={v.id} className="flex items-center gap-2 bg-background border border-primary/20 px-2 py-1 rounded cursor-pointer hover:bg-primary/5 transition-colors">
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Aktywne pola</label>
                          <div className="flex flex-wrap gap-2">
                            {previewItem.fields.map(f => (
                              <label key={f.source} className="flex items-center gap-2 bg-background border border-primary/20 px-2 py-1 rounded cursor-pointer hover:bg-primary/5 transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={(activeVariants[previewItem.id] || previewItem.fields?.map(field => field.source)).includes(f.source)}
                                  onChange={() => toggleVariant(previewItem.id, f.source)}
                                  className="accent-primary w-3 h-3"
                                />
                                <span className="text-[10px] font-bold uppercase">{f.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button onClick={() => handleRoll(previewItem as RandomTable)} className="wfrp-button h-[46px] px-6">
                        <Dice5 className="w-4 h-4 mr-2" /> Losuj
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {results.length === 0 ? (
                        <div className="py-12 text-center text-primary/30 italic">
                          <Dice5 className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p>Kliknij w kafel tabeli, aby wylosować wyniki.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                            <div className="space-y-3">
                              {results.slice(0, lastRollCount).map((res, i) => (
                                <div 
                                  key={`current-${i}`} 
                                  className="p-5 rounded border-2 border-primary/40 bg-primary/10 font-serif italic text-lg font-bold text-primary shadow-md animate-in slide-in-from-right-4 duration-300"
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-sans not-italic opacity-30 uppercase tracking-widest">Wynik #{results.length - i}</span>
                                  </div>
                                  <ResultRenderer data={res} />
                                </div>
                              ))}
                            </div>

                          {results.length > lastRollCount && (
                            <div className="pt-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                                className="w-full border-t border-primary/10 rounded-none text-primary/40 hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest py-4"
                              >
                                {isHistoryExpanded ? 'Ukryj poprzednie rzuty' : `Pokaż poprzednie rzuty (${results.length - lastRollCount})`}
                              </Button>
                              
                              {isHistoryExpanded && (
                                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {results.slice(lastRollCount).map((res, i) => (
                                      <div 
                                        key={`history-${i}`} 
                                        className="p-4 rounded border border-primary/10 bg-background/30 font-serif italic text-base text-primary/60"
                                      >
                                        <span className="text-[10px] font-sans not-italic mr-4 opacity-20">#{results.length - lastRollCount - i}</span>
                                        <ResultRenderer data={res} isNested={true} />
                                      </div>
                                    ))}
                                  </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
                        <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">Rasa</span>
                        <span className="text-lg font-bold text-primary">{(previewItem as CharacterArchive).race}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">Profesja</span>
                        <span className="text-lg font-bold text-primary">{(previewItem as CharacterArchive).profession}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-primary/40">System</span>
                        <span className="text-lg font-bold text-primary">Warhammer {(previewItem as CharacterArchive).edition}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Statystyki Główne</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-primary/10">
                              {Object.keys((previewItem as CharacterArchive).stats).map(s => (
                                <th key={s} className="border border-primary/20 p-2 text-[10px] font-black text-primary">{s}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {Object.values((previewItem as CharacterArchive).stats).map((val, i) => (
                                <td key={i} className="border border-primary/20 p-2 text-center font-bold text-primary">{val}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {(previewItem as CharacterArchive).secondaryStats && (
                        <>
                          <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 mt-6">Statystyki Poboczne</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-primary/5">
                                  {Object.keys((previewItem as CharacterArchive).secondaryStats!).map(s => (
                                    <th key={s} className="border border-primary/20 p-2 text-[10px] font-black text-primary/60">{s}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {Object.values((previewItem as CharacterArchive).secondaryStats!).map((val, i) => (
                                    <td key={i} className="border border-primary/20 p-2 text-center font-bold text-primary/80">{val}</td>
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
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Umiejętności</h4>
                        <div className="flex flex-wrap gap-2">
                          {(previewItem as CharacterArchive).skills.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-xs font-bold text-primary/70">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Zdolności</h4>
                        <div className="flex flex-wrap gap-2">
                          {(previewItem as CharacterArchive).talents.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-xs font-bold text-primary/70">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Ekwipunek</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(previewItem as CharacterArchive).equipment.map((item, idx) => (
                          <div key={idx} className="bg-background/30 p-2 rounded border border-primary/10 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Notatki</h4>
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

    </div>
  );
}
