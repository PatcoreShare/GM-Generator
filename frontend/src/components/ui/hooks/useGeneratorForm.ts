import { useState, useRef, useEffect } from 'react';
import {
  CharacterEquipmentItem,
  CharacterMeleeWeapon,
  CharacterRangedWeapon,
  CharacterArmourItem,
  CharacterSkillItem,
  CharacterTalentItem,
} from '../../../types';

interface UseGeneratorFormParams {
  initialData: any;
  allTables: any[];
  onSave: (item: any) => void;
  onCancel: () => void;
  currentUser: any;
  type: 'table' | 'note' | 'character' | 'dice';
}

export function useGeneratorForm({
  initialData,
  allTables,
  onSave,
  onCancel,
  currentUser,
  type,
}: UseGeneratorFormParams) {
  const [name, setName] = useState(initialData?.name || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');

  const [description, setDescription] = useState(initialData?.description || '');
  const [subType, setSubType] = useState(initialData?.subType || 'simple');

  const [options, setOptions] = useState(initialData?.options || []);
  const [variants, setVariants] = useState(initialData?.variants || []);
  const [fields, setFields] = useState(initialData?.fields || []);
  const [multiTables, setMultiTables] = useState(initialData?.multiTables || {});

  const [noteBlocks, setNoteBlocks] = useState(initialData?.blocks || []);

  const [edition, setEdition] = useState(initialData?.edition || '2ed');
  const [race, setRace] = useState(initialData?.race || '');
  const [profession, setProfession] = useState(initialData?.profession || '');
  const [charDescription, setCharDescription] = useState(
    initialData?.description || ''
  );

  const stats2ed = ['WW', 'US', 'K', 'Odp', 'Zr', 'Int', 'SW', 'Ogd'];
  const stats4ed = ['WW', 'US', 'S', 'Wt', 'Zr', 'I', 'Dex', 'Int', 'SW', 'Ogd'];
  const secondaryStats2ed = ['A', 'Żyw', 'S', 'Wt', 'Sz', 'Mag', 'PO', 'PP'];

  const buildDefaultStats = (
    keys: string[],
    source?: Record<string, number | string>
  ) =>
    Object.fromEntries(
      keys.map((key) => {
        const raw = source && key in source ? source[key] : 0;
        const numeric = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
        return [key, Number.isNaN(numeric) ? 0 : numeric];
      })
    );

  const [stats, setStats] = useState(
    initialData?.stats ||
      buildDefaultStats(
        (initialData?.edition || '2ed') === '2ed' ? stats2ed : stats4ed
      )
  );

  const [secondaryStats, setSecondaryStats] = useState(
    initialData?.secondaryStats || buildDefaultStats(secondaryStats2ed)
  );

  const normalizeSkills = (raw: any): CharacterSkillItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((skillName: string) => ({
        id: crypto.randomUUID(),
        characteristic: '',
        name: skillName,
      }));
    }
    return raw as CharacterSkillItem[];
  };

  const normalizeTalents = (raw: any): CharacterTalentItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((talentName: string) => ({
        id: crypto.randomUUID(),
        name: talentName,
        description: '',
      }));
    }
    return raw as CharacterTalentItem[];
  };

  const [skills, setSkills] = useState<CharacterSkillItem[]>(
    normalizeSkills(initialData?.skills)
  );

  const [talents, setTalents] = useState<CharacterTalentItem[]>(
    normalizeTalents(initialData?.talents)
  );

  const normalizeEquipment = (raw: any): CharacterEquipmentItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((itemName: string) => ({
        id: crypto.randomUUID(),
        name: itemName,
        quantity: 1,
        encumbrance: 0,
      }));
    }
    return raw as CharacterEquipmentItem[];
  };

  const [equipment, setEquipment] = useState<CharacterEquipmentItem[]>(
    normalizeEquipment(initialData?.equipment)
  );

  const [notes, setNotes] = useState(initialData?.notes || '');

  const normalizeMelee = (raw: any): CharacterMeleeWeapon[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((weaponName: string) => ({
        id: crypto.randomUUID(),
        name: weaponName,
        group: '',
        damage: '',
        qualities: '',
        encumbrance: 0,
      }));
    }
    return raw as CharacterMeleeWeapon[];
  };

  const normalizeRanged = (raw: any): CharacterRangedWeapon[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((weaponName: string) => ({
        id: crypto.randomUUID(),
        name: weaponName,
        group: '',
        range: '',
        damage: '',
        reload: '',
        ammoType: '',
        qualities: '',
        encumbrance: 0,
      }));
    }
    return raw as CharacterRangedWeapon[];
  };

  const normalizeArmour = (raw: any): CharacterArmourItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && typeof raw[0] === 'string') {
      return raw.map((armourName: string) => ({
        id: crypto.randomUUID(),
        name: armourName,
        head: '',
        body: '',
        arms: '',
        legs: '',
        specialRules: '',
        encumbrance: 0,
      }));
    }
    return raw as CharacterArmourItem[];
  };

  const [meleeWeapons, setMeleeWeapons] = useState<CharacterMeleeWeapon[]>(
    normalizeMelee(initialData?.meleeWeapons)
  );
  const [rangedWeapons, setRangedWeapons] = useState<CharacterRangedWeapon[]>(
    normalizeRanged(initialData?.rangedWeapons)
  );
  const [armour, setArmour] = useState<CharacterArmourItem[]>(
    normalizeArmour(initialData?.armour)
  );

  const [encumbrance, setEncumbrance] = useState(
    initialData?.encumbrance || { current: '', max: '', notes: '' }
  );

  const toNumber = (value: number | string | undefined, fallback = 0) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const computedCurrentEncumbrance =
    equipment.reduce(
      (sum, item) =>
        sum + toNumber(item.encumbrance) * Math.max(1, toNumber(item.quantity, 1)),
      0
    ) +
    meleeWeapons.reduce((sum, item) => sum + toNumber(item.encumbrance), 0) +
    rangedWeapons.reduce((sum, item) => sum + toNumber(item.encumbrance), 0) +
    armour.reduce((sum, item) => sum + toNumber(item.encumbrance), 0);

  useEffect(() => {
    setEncumbrance((prev) => ({
      ...prev,
      current: computedCurrentEncumbrance,
    }));
  }, [computedCurrentEncumbrance]);

  const [diceFormula, setDiceFormula] = useState(initialData?.formula || '');
  const [diceDescription, setDiceDescription] = useState(
    initialData?.description || ''
  );

  const [showTablePicker, setShowTablePicker] = useState(null);

  const lastInputRef = useRef(null);
  const lastMultiInputRef = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusNewOption, setFocusNewOption] = useState(false);
  const [focusNewMultiSource, setFocusNewMultiSource] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (edition === '2ed') {
      setStats((prev) => buildDefaultStats(stats2ed, prev));
      setSecondaryStats((prev) => buildDefaultStats(secondaryStats2ed, prev));
    } else {
      setStats((prev) => buildDefaultStats(stats4ed, prev));
    }
  }, [edition]);

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: '', weight: 1 },
    ]);
    setFocusNewOption(true);
  };

  const updateOption = (optionId: string, patch: Partial<any>) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt))
    );
  };

  const removeOption = (optionId: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', options: [] },
    ]);
  };

  const addComplexField = () => {
    const source = `field_${fields.length + 1}`;

    setFields((prev) => [...prev, { label: '', source }]);

    setMultiTables((prev) => ({
      ...prev,
      [source]: [],
    }));
  };

  const updateField = (index: number, patch: Partial<any>) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, ...patch } : field))
    );
  };

  const renameFieldSource = (index: number, newSource: string) => {
    setFields((prev) => {
      const oldSource = prev[index]?.source;
      const next = prev.map((field, i) =>
        i === index ? { ...field, source: newSource } : field
      );

      if (!oldSource || oldSource === newSource) return next;

      setMultiTables((prevMulti) => {
        const cloned: Record<string, any[]> = { ...prevMulti };
        cloned[newSource] = [...(cloned[oldSource] || [])];
        delete cloned[oldSource];
        return cloned;
      });

      return next;
    });
  };

  const removeField = (index: number) => {
    const sourceToDelete = fields[index]?.source;

    setFields((prev) => prev.filter((_, i) => i !== index));

    if (sourceToDelete) {
      setMultiTables((prev) => {
        const cloned: Record<string, any[]> = { ...prev };
        delete cloned[sourceToDelete];
        return cloned;
      });
    }
  };

  const addOptionToMultiTable = (source: string) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: [
        ...(prev[source] || []),
        { id: crypto.randomUUID(), text: '', weight: 1 },
      ],
    }));
    setFocusNewMultiSource(source);
  };

  const updateMultiTableOption = (
    source: string,
    optionId: string,
    patch: Partial<any>
  ) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: (prev[source] || []).map((opt: any) =>
        opt.id === optionId ? { ...opt, ...patch } : opt
      ),
    }));
  };

  const removeMultiTableOption = (source: string, optionId: string) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: (prev[source] || []).filter((opt: any) => opt.id !== optionId),
    }));
  };

  const addNoteBlock = (blockType: 'text' | 'image') => {
    setNoteBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: blockType,
        content: '',
        width: blockType === 'image' ? '100%' : undefined,
      },
    ]);
  };

  const moveNoteBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...noteBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    setNoteBlocks(newBlocks);
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      callback?.();
    }
  };

  useEffect(() => {
    if (focusNewOption && lastInputRef.current) {
      lastInputRef.current.focus();
      setFocusNewOption(false);
    }
  }, [options, focusNewOption]);

  useEffect(() => {
    if (focusNewMultiSource && lastMultiInputRef.current[focusNewMultiSource]) {
      lastMultiInputRef.current[focusNewMultiSource]?.focus();
      setFocusNewMultiSource(null);
    }
  }, [multiTables, focusNewMultiSource]);

  const handleRollFromTable = (table: any, field: string, index?: number) => {
    if (!table) return;

    if (field === 'nestedTable' && showTablePicker?.optionId) {
      if (showTablePicker?.source) {
        updateMultiTableOption(showTablePicker.source, showTablePicker.optionId, {
          nestedTableId: table.id,
          text: '',
        });
      } else {
        updateOption(showTablePicker.optionId, {
          nestedTableId: table.id,
          text: '',
        });
      }

      setShowTablePicker(null);
      return;
    }

    let sourceOptions: any[] = [];

    if (Array.isArray(table.options) && table.options.length > 0) {
      sourceOptions = table.options;
    } else if (table.subType === 'simple' && Array.isArray(table.variants)) {
      sourceOptions = table.variants.flatMap(
        (variant: any) => variant.options || []
      );
    }

    if (!sourceOptions.length) {
      setShowTablePicker(null);
      return;
    }

    const totalWeight = sourceOptions.reduce(
      (sum, option) => sum + (Number(option.weight) || 1),
      0
    );

    let random = Math.random() * totalWeight;
    let selected = sourceOptions[0];

    for (const option of sourceOptions) {
      random -= Number(option.weight) || 1;
      if (random <= 0) {
        selected = option;
        break;
      }
    }

    const rolledValue = selected?.text || '';

    if (field === 'name') {
      setName(rolledValue);
    } else if (field === 'profession') {
      setProfession(rolledValue);
    } else if (field === 'skills' && typeof index === 'number') {
      setSkills((prev) =>
        prev.map((skill, i) =>
          i === index ? { ...skill, name: rolledValue } : skill
        )
      );
    } else if (field === 'talents' && typeof index === 'number') {
      setTalents((prev) =>
        prev.map((talent, i) =>
          i === index ? { ...talent, name: rolledValue } : talent
        )
      );
    }

    setShowTablePicker(null);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();

    if (!name.trim()) return;

    const normalizedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    const baseItem = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      tags: normalizedTags,
      ownerId: initialData?.ownerId || currentUser?.id,
      ownerName: initialData?.ownerName || currentUser?.username,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    let item: any = null;

    if (type === 'table') {
      item = {
        ...baseItem,
        type: 'table',
        description,
        subType,
        options: subType === 'simple' ? options : [],
        variants: subType === 'simple' ? variants : [],
        fields: subType === 'complex' ? fields : undefined,
        multiTables: subType === 'complex' ? multiTables : undefined,
      };
    }

    if (type === 'note') {
      item = {
        ...baseItem,
        type: 'note',
        blocks: noteBlocks,
      };
    }

    if (type === 'character') {
      item = {
        ...baseItem,
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
        meleeWeapons,
        rangedWeapons,
        armour,
        encumbrance: {
          ...encumbrance,
          current: computedCurrentEncumbrance,
        },
      };
    }

    if (type === 'dice') {
      item = {
        ...baseItem,
        type: 'dice',
        formula: diceFormula.trim(),
        description: diceDescription.trim(),
      };
    }

    if (!item) return;

    onSave(item);
  };

  return {
    initialData,
    type,
    allTables,
    onCancel,
    currentUser,

    name,
    setName,
    tags,
    setTags,

    description,
    setDescription,
    subType,
    setSubType,
    options,
    setOptions,
    variants,
    setVariants,
    fields,
    setFields,
    multiTables,
    setMultiTables,

    noteBlocks,
    setNoteBlocks,

    edition,
    setEdition,
    race,
    setRace,
    profession,
    setProfession,
    charDescription,
    setCharDescription,
    stats,
    setStats,
    secondaryStats,
    setSecondaryStats,
    skills,
    setSkills,
    talents,
    setTalents,
    equipment,
    setEquipment,
    notes,
    setNotes,

    meleeWeapons,
    setMeleeWeapons,
    rangedWeapons,
    setRangedWeapons,
    armour,
    setArmour,

    encumbrance,
    setEncumbrance,

    diceFormula,
    setDiceFormula,
    diceDescription,
    setDiceDescription,

    stats2ed,
    stats4ed,
    secondaryStats2ed,

    showTablePicker,
    setShowTablePicker,

    lastInputRef,
    lastMultiInputRef,

    addOption,
    updateOption,
    removeOption,
    addVariant,

    addComplexField,
    updateField,
    renameFieldSource,
    removeField,

    addOptionToMultiTable,
    updateMultiTableOption,
    removeMultiTableOption,

    addNoteBlock,
    moveNoteBlock,
    handleKeyDown,
    handleRollFromTable,
    handleSave,
  };
}