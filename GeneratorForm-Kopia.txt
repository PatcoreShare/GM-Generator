import React, { useState, useRef, useEffect } from 'react';
import { ArchiveItem, RandomTable, TableOption, User, NoteArchive, CharacterArchive, TableVariant, NoteBlock, TableField } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, Plus, Save, X, Image as ImageIcon, User as UserIcon, Table as TableIcon, FileText, Dice5, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratorFormProps {
  initialData?: ArchiveItem;
  allTables: RandomTable[];
  onSave: (item: ArchiveItem) => void;
  onCancel: () => void;
  currentUser: User;
  type: 'table' | 'note' | 'character';
}

export function GeneratorForm({ initialData, allTables, onSave, onCancel, currentUser, type }: GeneratorFormProps) {
  // Common fields
  const [name, setName] = useState(initialData?.name || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');

  // Table fields
  const [subType, setSubType] = useState<'simple' | 'complex'>((initialData as RandomTable)?.subType || 'simple');
  const [description, setDescription] = useState((initialData as RandomTable)?.description || '');
  const [options, setOptions] = useState<TableOption[]>(
    (initialData as RandomTable)?.options || [{ id: crypto.randomUUID(), text: '', weight: 1 }]
  );
  const [variants, setVariants] = useState<TableVariant[]>(
    (initialData as RandomTable)?.variants || []
  );
  const [fields, setFields] = useState<TableField[]>(
    (initialData as RandomTable)?.fields || [{ label: 'Wynik', source: 'default' }]
  );
  const [multiTables, setMultiTables] = useState<Record<string, TableOption[]>>(
    (initialData as RandomTable)?.multiTables || { default: [{ id: crypto.randomUUID(), text: '', weight: 1 }] }
  );
  
  // Note fields
  const [noteBlocks, setNoteBlocks] = useState<NoteBlock[]>(
    (initialData as NoteArchive)?.blocks || [{ id: crypto.randomUUID(), type: 'text', content: '' }]
  );

  // Character fields
  const [edition, setEdition] = useState<'2ed' | '4ed'>((initialData as CharacterArchive)?.edition || '4ed');
  const [race, setRace] = useState((initialData as CharacterArchive)?.race || '');
  const [profession, setProfession] = useState((initialData as CharacterArchive)?.profession || '');
  const [charDescription, setCharDescription] = useState((initialData as CharacterArchive)?.description || '');
  const [stats, setStats] = useState<Record<string, number>>((initialData as CharacterArchive)?.stats || {});
  const [secondaryStats, setSecondaryStats] = useState<Record<string, number>>((initialData as CharacterArchive)?.secondaryStats || {});
  const [skills, setSkills] = useState<string[]>((initialData as CharacterArchive)?.skills || []);
  const [talents, setTalents] = useState<string[]>((initialData as CharacterArchive)?.talents || []);
  const [equipment, setEquipment] = useState<string[]>((initialData as CharacterArchive)?.equipment || []);
  const [notes, setNotes] = useState((initialData as CharacterArchive)?.notes || '');

  const lastInputRef = useRef<HTMLInputElement>(null);
  const lastVariantInputRef = useRef<HTMLInputElement>(null);
  const lastMultiInputRef = useRef<Record<string, HTMLInputElement | null>>({});
  const [shouldFocus, setShouldFocus] = useState<'options' | 'variants' | string | null>(null);

  // Table selection for rolling fields
  const [showTablePicker, setShowTablePicker] = useState<{ field: string; index?: number; optionId?: string; source?: string } | null>(null);

  useEffect(() => {
    if (shouldFocus === 'options' && lastInputRef.current) {
      lastInputRef.current.focus();
      setShouldFocus(null);
    } else if (shouldFocus === 'variants' && lastVariantInputRef.current) {
      lastVariantInputRef.current.focus();
      setShouldFocus(null);
    } else if (typeof shouldFocus === 'string' && lastMultiInputRef.current[shouldFocus]) {
      lastMultiInputRef.current[shouldFocus]?.focus();
      setShouldFocus(null);
    }
  }, [shouldFocus, options.length, variants.length, multiTables]);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: '', weight: 1 }]);
    setShouldFocus('options');
  };

  const addVariant = () => {
    setVariants([...variants, { id: crypto.randomUUID(), name: 'Nowy Wariant', options: [{ id: crypto.randomUUID(), text: '', weight: 1 }] }]);
    setShouldFocus('variants');
  };

  const addOptionToVariant = (vIdx: number) => {
    const newVariants = [...variants];
    newVariants[vIdx].options.push({ id: crypto.randomUUID(), text: '', weight: 1 });
    setVariants(newVariants);
    setShouldFocus('variants');
  };

  const handleRollFromTable = (table: RandomTable, field: string, index?: number) => {
    const optionId = showTablePicker?.optionId;
    const source = showTablePicker?.source;
    
    if (field === 'nestedTable' && optionId) {
      if (source) {
        const newMulti = { ...multiTables };
        const optIdx = newMulti[source].findIndex(o => o.id === optionId);
        if (optIdx !== -1) {
          newMulti[source][optIdx].nestedTableId = table.id;
          newMulti[source][optIdx].text = ''; // Clear text if table is selected
          setMultiTables(newMulti);
        }
      } else {
        setOptions(options.map(o => o.id === optionId ? { ...o, nestedTableId: table.id, text: '' } : o));
      }
      setShowTablePicker(null);
      return;
    }

    const totalWeight = table.options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;
    let result = "";
    
    for (const option of table.options) {
      random -= option.weight;
      if (random <= 0) {
        result = option.text;
        break;
      }
    }

    if (field === 'name') setName(result);
    if (field === 'profession') setProfession(result);
    if (field === 'skills' && index !== undefined) {
      const newSkills = [...skills];
      newSkills[index] = result;
      setSkills(newSkills);
    }
    if (field === 'talents' && index !== undefined) {
      const newTalents = [...talents];
      newTalents[index] = result;
      setTalents(newTalents);
    }
    if (field === 'nestedTable' && optionId) {
      if (source) {
        const newMulti = { ...multiTables };
        const optIdx = newMulti[source].findIndex(o => o.id === optionId);
        if (optIdx !== -1) {
          newMulti[source][optIdx].nestedTableId = table.id;
          setMultiTables(newMulti);
        }
      } else {
        setOptions(options.map(o => o.id === optionId ? { ...o, nestedTableId: table.id } : o));
      }
    }
    setShowTablePicker(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Nazwa jest wymagana");
      return;
    }

    let item: ArchiveItem;

    if (type === 'table') {
      item = {
        id: initialData?.id || crypto.randomUUID(),
        name,
        description,
        type: 'table',
        subType,
        options: subType === 'simple' ? options : [],
        variants: subType === 'simple' ? variants : [],
        fields: subType === 'complex' ? fields : undefined,
        multiTables: subType === 'complex' ? multiTables : undefined,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        ownerId: initialData?.ownerId || currentUser.id,
        ownerName: initialData?.ownerName || currentUser.username,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };
    } else if (type === 'note') {
      item = {
        id: initialData?.id || crypto.randomUUID(),
        name,
        type: 'note',
        blocks: noteBlocks,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        ownerId: initialData?.ownerId || currentUser.id,
        ownerName: initialData?.ownerName || currentUser.username,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };
    } else {
      item = {
        id: initialData?.id || crypto.randomUUID(),
        name,
        type: 'character',
        edition,
        race,
        profession,
        description: charDescription,
        stats,
        secondaryStats: edition === '2ed' ? secondaryStats : undefined,
        skills,
        talents,
        equipment,
        notes,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        ownerId: initialData?.ownerId || currentUser.id,
        ownerName: initialData?.ownerName || currentUser.username,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };
    }

    onSave(item);
  };

  const addNoteBlock = (blockType: 'text' | 'image') => {
    setNoteBlocks([...noteBlocks, { id: crypto.randomUUID(), type: blockType, content: '', width: blockType === 'image' ? '100%' : undefined }]);
  };

  const moveNoteBlock = (idx: number, direction: 'up' | 'down') => {
    const newBlocks = [...noteBlocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setNoteBlocks(newBlocks);
  };

  const addComplexField = () => {
    const sourceId = `table_${crypto.randomUUID().slice(0, 8)}`;
    setFields([...fields, { label: 'Nowe Pole', source: sourceId }]);
    setMultiTables({ ...multiTables, [sourceId]: [{ id: crypto.randomUUID(), text: '', weight: 1 }] });
  };

  const addOptionToMultiTable = (source: string) => {
    const newMulti = { ...multiTables };
    newMulti[source] = [...(newMulti[source] || []), { id: crypto.randomUUID(), text: '', weight: 1 }];
    setMultiTables(newMulti);
    setShouldFocus(source);
  };

  const stats2ed = ['WW', 'US', 'K', 'Odp', 'Zr', 'Int', 'SW', 'Ogd'];
  const secondaryStats2ed = ['A', 'Żyw', 'S', 'Wt', 'Sz', 'Mag', 'PO', 'PP'];
  const stats4ed = ['WW', 'US', 'S', 'Wt', 'I', 'Zw', 'Zr', 'Int', 'SW', 'Ogd'];

  return (
    <form onSubmit={handleSave} className="parchment-card p-8 space-y-6 border-primary/40 shadow-xl">
      <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded">
            {type === 'table' && <TableIcon className="w-6 h-6 text-primary" />}
            {type === 'note' && <FileText className="w-6 h-6 text-primary" />}
            {type === 'character' && <UserIcon className="w-6 h-6 text-primary" />}
          </div>
          <h2 className="text-2xl font-black fancy-heading uppercase tracking-tight text-primary">
            {initialData ? 'Edycja Archiwum' : `Nowa ${type === 'table' ? 'Tabela' : type === 'note' ? 'Notatka' : 'Postać'}`}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-primary/60 hover:text-primary uppercase text-xs font-bold tracking-widest">
            <X className="w-4 h-4 mr-2" /> Anuluj
          </Button>
          <Button type="submit" className="wfrp-button">
            <Save className="w-4 h-4 mr-2" /> Zapisz w Archiwum
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">Nazwa / Imię</label>
          <div className="flex gap-2">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Wpisz nazwę..."
              className="bg-background border-primary/30 font-bold"
            />
            {type === 'character' && (
              <Button type="button" variant="outline" size="icon" onClick={() => setShowTablePicker({ field: 'name' })} className="border-primary/30 text-primary">
                <Dice5 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary">Tagi (oddzielone przecinkami)</label>
          <Input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="np. Walka, Miasto, Karczma"
            className="bg-background border-primary/30"
          />
        </div>

        {type === 'table' && (
          <>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Opis</label>
              <Input 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Opcjonalny opis..."
                className="bg-background border-primary/30"
              />
            </div>

            <div className="md:col-span-2 flex gap-4 bg-primary/5 p-4 rounded border border-primary/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={subType === 'simple'} onChange={() => setSubType('simple')} className="accent-primary" />
                <span className="text-sm font-bold">Tabela Prosta</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={subType === 'complex'} onChange={() => setSubType('complex')} className="accent-primary" />
                <span className="text-sm font-bold">Tabela Złożona (Wiele Pól)</span>
              </label>
            </div>

            {subType === 'simple' ? (
              <div className="space-y-4 pt-4 md:col-span-2">
                <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Opcje Główne</label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-8 border-primary/30 text-primary hover:bg-primary/10">
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
                            {allTables.find(t => t.id === option.nestedTableId)?.name || 'Nieznana Tabela'}
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setOptions(options.map(o => o.id === option.id ? { ...o, nestedTableId: undefined } : o))}
                            className="h-6 text-[10px] uppercase font-bold text-destructive hover:bg-destructive/10"
                          >
                            Zmień na tekst
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 flex gap-2">
                          <Input 
                            value={option.text} 
                            onChange={(e) => setOptions(options.map(o => o.id === option.id ? {...o, text: e.target.value} : o))}
                            onKeyDown={(e) => handleKeyDown(e, addOption)}
                            placeholder="Tekst wyniku..."
                            className="bg-background border-primary/30"
                            ref={index === options.length - 1 ? lastInputRef : null}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setShowTablePicker({ field: 'nestedTable', optionId: option.id })}
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
                        onChange={(e) => setOptions(options.map(o => o.id === option.id ? {...o, weight: parseInt(e.target.value) || 1} : o))}
                        className="w-20 bg-background border-primary/30 text-center"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setOptions(options.filter(o => o.id !== option.id))} className="text-primary/20 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4 md:col-span-2">
                <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Pola Generatora</label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addComplexField} className="h-8 border-primary/30 text-primary hover:bg-primary/10">
                      <Plus className="w-3 h-3 mr-2" /> Dodaj Pole
                    </Button>
                  </div>
                </div>

                {fields.map((field, fIdx) => (
                  <div key={fIdx} className="p-4 border border-primary/20 rounded bg-primary/5 space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary/60">Etykieta Pola</label>
                        <Input 
                          value={field.label}
                          onChange={(e) => {
                            const newFields = [...fields];
                            newFields[fIdx].label = e.target.value;
                            setFields(newFields);
                          }}
                          className="bg-background border-primary/30 font-bold"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary/60">Źródło (Klucz Tabeli)</label>
                        <Input 
                          value={field.source}
                          onChange={(e) => {
                            const oldSource = field.source;
                            const newSource = e.target.value;
                            const newFields = [...fields];
                            newFields[fIdx].source = newSource;
                            setFields(newFields);
                            
                            const newMulti = { ...multiTables };
                            if (newMulti[oldSource]) {
                              newMulti[newSource] = newMulti[oldSource];
                              delete newMulti[oldSource];
                            }
                            setMultiTables(newMulti);
                          }}
                          className="bg-background border-primary/30 font-mono text-xs"
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => {
                        const newFields = fields.filter((_, i) => i !== fIdx);
                        setFields(newFields);
                        const newMulti = { ...multiTables };
                        delete newMulti[field.source];
                        setMultiTables(newMulti);
                      }} className="mt-5 text-destructive/60">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase text-primary/40">Tabela dla: {field.source}</label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => addOptionToMultiTable(field.source)} className="h-6 text-[10px] text-primary">
                          + Dodaj Pozycję
                        </Button>
                      </div>
                      {multiTables[field.source]?.map((opt, oIdx) => (
                        <div key={opt.id} className="flex gap-2">
                          {opt.nestedTableId ? (
                            <div className="flex-1 flex gap-2 items-center bg-primary/5 border border-primary/30 rounded px-2 h-8">
                              <TableIcon className="w-3 h-3 text-primary/60" />
                              <span className="text-[10px] font-bold text-primary flex-1 truncate">
                                {allTables.find(t => t.id === opt.nestedTableId)?.name || 'Nieznana Tabela'}
                              </span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  const newMulti = { ...multiTables };
                                  newMulti[field.source][oIdx].nestedTableId = undefined;
                                  setMultiTables(newMulti);
                                }}
                                className="h-5 px-1 text-[8px] uppercase font-bold text-destructive hover:bg-destructive/10"
                              >
                                Tekst
                              </Button>
                            </div>
                          ) : (
                            <div className="flex-1 flex gap-2">
                              <Input 
                                value={opt.text}
                                onChange={(e) => {
                                  const newMulti = { ...multiTables };
                                  newMulti[field.source][oIdx].text = e.target.value;
                                  setMultiTables(newMulti);
                                }}
                                onKeyDown={(e) => handleKeyDown(e, () => addOptionToMultiTable(field.source))}
                                className="bg-background border-primary/30 h-8 text-xs"
                                ref={el => lastMultiInputRef.current[field.source] = el}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                onClick={() => setShowTablePicker({ field: 'nestedTable', optionId: opt.id, source: field.source })}
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
                            onChange={(e) => {
                              const newMulti = { ...multiTables };
                              newMulti[field.source][oIdx].weight = parseInt(e.target.value) || 1;
                              setMultiTables(newMulti);
                            }}
                            className="w-16 bg-background border-primary/30 h-8 text-xs text-center"
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => {
                            const newMulti = { ...multiTables };
                            newMulti[field.source] = newMulti[field.source].filter(o => o.id !== opt.id);
                            setMultiTables(newMulti);
                          }} className="h-8 w-8 text-primary/20">
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
        )}

        {type === 'note' && (
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-primary/20 pb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Bloki Notatki</label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => addNoteBlock('text')} className="h-8 border-primary/30 text-primary">
                  <Plus className="w-3 h-3 mr-2" /> Dodaj Tekst
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addNoteBlock('image')} className="h-8 border-primary/30 text-primary">
                  <ImageIcon className="w-3 h-3 mr-2" /> Dodaj Obraz
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {noteBlocks.map((block, idx) => (
                <div key={block.id} className="relative group bg-primary/5 p-4 rounded border border-primary/10">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <div className="flex flex-col gap-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveNoteBlock(idx, 'up')} 
                        disabled={idx === 0}
                        className="h-6 w-6 rounded-full bg-background border border-primary/20 text-primary/60 hover:text-primary disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveNoteBlock(idx, 'down')} 
                        disabled={idx === noteBlocks.length - 1}
                        className="h-6 w-6 rounded-full bg-background border border-primary/20 text-primary/60 hover:text-primary disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => setNoteBlocks(noteBlocks.filter(b => b.id !== block.id))} className="h-6 w-6 rounded-full shadow-lg">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {block.type === 'text' ? (
                    <textarea 
                      value={block.content}
                      onChange={(e) => {
                        const newBlocks = [...noteBlocks];
                        newBlocks[idx].content = e.target.value;
                        setNoteBlocks(newBlocks);
                      }}
                      className="w-full min-h-[100px] bg-transparent border-none font-serif italic text-lg focus:ring-0 resize-none"
                      placeholder="Wpisz tekst..."
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input 
                          value={block.content}
                          onChange={(e) => {
                            const newBlocks = [...noteBlocks];
                            newBlocks[idx].content = e.target.value;
                            setNoteBlocks(newBlocks);
                          }}
                          placeholder="URL obrazka..."
                          className="bg-background border-primary/30 text-xs"
                        />
                        <Input 
                          value={block.width}
                          onChange={(e) => {
                            const newBlocks = [...noteBlocks];
                            newBlocks[idx].width = e.target.value;
                            setNoteBlocks(newBlocks);
                          }}
                          placeholder="Szerokość (np. 100%)"
                          className="w-32 bg-background border-primary/30 text-xs"
                        />
                      </div>
                      {block.content && (
                        <div className="flex justify-center border border-primary/10 rounded overflow-hidden bg-background/50">
                          <img src={block.content} alt="Podgląd" className="max-h-40 object-contain" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'character' && (
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center bg-primary/5 p-4 rounded border border-primary/10">
              <div className="flex gap-4 items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Edycja:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={edition === '2ed'} onChange={() => setEdition('2ed')} className="accent-primary" />
                    <span className="text-sm font-bold">Warhammer 2ed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={edition === '4ed'} onChange={() => setEdition('4ed')} className="accent-primary" />
                    <span className="text-sm font-bold">Warhammer 4ed</span>
                  </label>
                </div>
              </div>
              <div className="h-8 w-px bg-primary/20 hidden sm:block" />
              <div className="flex gap-4 items-center flex-1">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Rasa:</label>
                {edition === '2ed' ? (
                  <select value={race} onChange={(e) => setRace(e.target.value)} className="bg-background border border-primary/30 rounded px-2 py-1 text-sm focus:outline-none">
                    <option value="">Wybierz...</option>
                    <option value="Człowiek">Człowiek</option>
                    <option value="Krasnolud">Krasnolud</option>
                    <option value="Elf">Elf</option>
                    <option value="Niziołek">Niziołek</option>
                  </select>
                ) : (
                  <Input value={race} onChange={(e) => setRace(e.target.value)} placeholder="Wpisz rasę..." className="bg-background border-primary/30 h-8 text-sm" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Profesja</label>
                <div className="flex gap-2">
                  <Input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="Wpisz profesję..." className="bg-background border-primary/30" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowTablePicker({ field: 'profession' })} className="border-primary/30 text-primary">
                    <Dice5 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Opis Wyglądu</label>
                <textarea value={charDescription} onChange={(e) => setCharDescription(e.target.value)} className="w-full h-10 bg-background border border-primary/30 rounded px-3 py-1 text-sm focus:outline-none" placeholder="Oczy, włosy, znaki szczególne..." />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-primary block border-b border-primary/20 pb-1">Statystyki</label>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/10">
                      {(edition === '2ed' ? stats2ed : stats4ed).map(s => (
                        <th key={s} className="border border-primary/20 p-2 text-[10px] font-black text-primary">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {(edition === '2ed' ? stats2ed : stats4ed).map(s => (
                        <td key={s} className="border border-primary/20 p-0">
                          <input 
                            type="number" 
                            value={stats[s] || 0} 
                            onChange={(e) => setStats({...stats, [s]: parseInt(e.target.value) || 0})}
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
                        {secondaryStats2ed.map(s => (
                          <th key={s} className="border border-primary/20 p-2 text-[10px] font-black text-primary/60">{s}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {secondaryStats2ed.map(s => (
                          <td key={s} className="border border-primary/20 p-0">
                            <input 
                              type="number" 
                              value={secondaryStats[s] || 0} 
                              onChange={(e) => setSecondaryStats({...secondaryStats, [s]: parseInt(e.target.value) || 0})}
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
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Umiejętności</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSkills([...skills, ''])} className="h-6 text-[10px] text-primary">
                    + Dodaj
                  </Button>
                </div>
                <div className="space-y-2">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={skill} onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[idx] = e.target.value;
                        setSkills(newSkills);
                      }} className="h-8 text-sm bg-background border-primary/30" />
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowTablePicker({ field: 'skills', index: idx })} className="h-8 w-8 border-primary/30 text-primary">
                        <Dice5 className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="h-8 w-8 text-primary/20">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-primary/20 pb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Zdolności</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setTalents([...talents, ''])} className="h-6 text-[10px] text-primary">
                    + Dodaj
                  </Button>
                </div>
                <div className="space-y-2">
                  {talents.map((talent, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={talent} onChange={(e) => {
                        const newTalents = [...talents];
                        newTalents[idx] = e.target.value;
                        setTalents(newTalents);
                      }} className="h-8 text-sm bg-background border-primary/30" />
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowTablePicker({ field: 'talents', index: idx })} className="h-8 w-8 border-primary/30 text-primary">
                        <Dice5 className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setTalents(talents.filter((_, i) => i !== idx))} className="h-8 w-8 text-primary/20">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-primary/20 pb-1">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Ekwipunek</label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEquipment([...equipment, ''])} className="h-6 text-[10px] text-primary">
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEquipment(equipment.filter((_, i) => i !== idx))} className="h-8 w-8 text-primary/20">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Notatki / Historia</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-32 bg-background border border-primary/30 rounded p-4 font-serif italic focus:outline-none" placeholder="Dalsze zapiski..." />
            </div>
          </div>
        )}
      </div>

      {showTablePicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="parchment-card max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-primary">
            <div className="flex justify-between items-center border-b border-primary/20 pb-2">
              <h3 className="font-black uppercase tracking-widest text-sm text-primary">Wybierz Tabelę do Rzutu</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowTablePicker(null)} className="h-6 w-6">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {allTables.map(table => (
                <button 
                  key={table.id}
                  type="button"
                  onClick={() => handleRollFromTable(table, showTablePicker.field, showTablePicker.index)}
                  className="w-full text-left p-3 rounded border border-primary/10 hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="block font-bold text-xs text-primary group-hover:text-primary">{table.name}</span>
                    <span className="text-[10px] text-primary/40 uppercase font-bold">{table.options.length} pozycji</span>
                  </div>
                  <Dice5 className="w-4 h-4 text-primary/20 group-hover:text-primary" />
                </button>
              ))}
              {allTables.length === 0 && (
                <p className="text-center py-4 text-xs text-primary/40 italic">Brak dostępnych tabel.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
