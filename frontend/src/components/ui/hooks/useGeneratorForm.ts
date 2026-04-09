import { useState, useRef, useEffect } from 'react';

export function useGeneratorForm({
  initialData,
  allTables,
  onSave,
  onCancel,
  currentUser,
  type,
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [isBuiltIn, setIsBuiltIn] = useState(Boolean(initialData?.isBuiltIn) || false);

  const [description, setDescription] = useState(initialData?.description || '');
  const [subType, setSubType] = useState(initialData?.subType || 'simple');

  const [options, setOptions] = useState(initialData?.options || []);
  const [variants, setVariants] = useState(initialData?.variants || []);
  const [fields, setFields] = useState(initialData?.fields || []);
  const [multiTables, setMultiTables] = useState(initialData?.multiTables || {});

  const [noteBlocks, setNoteBlocks] = useState(initialData?.blocks || []);

  const [edition, setEdition] = useState(initialData?.edition || '4ed');
  const [race, setRace] = useState(initialData?.race || '');
  const [profession, setProfession] = useState(initialData?.profession || '');
  const [charDescription, setCharDescription] = useState(initialData?.description || '');
  const [stats, setStats] = useState(initialData?.stats || {});
  const [secondaryStats, setSecondaryStats] = useState(initialData?.secondaryStats || {});
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [talents, setTalents] = useState(initialData?.talents || []);
  const [equipment, setEquipment] = useState(initialData?.equipment || []);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [showTablePicker, setShowTablePicker] = useState(null);

  const lastInputRef = useRef(null);
  const lastMultiInputRef = useRef({});
  const [focusNewOption, setFocusNewOption] = useState(false);
  const [focusNewMultiSource, setFocusNewMultiSource] = useState(null);

  const stats2ed = ['WW', 'US', 'K', 'Odp', 'Zr', 'Int', 'SW', 'Ogd'];
  const stats4ed = ['WW', 'US', 'S', 'Wt', 'Zr', 'I', 'Dex', 'Int', 'SW', 'Ogd'];
  const secondaryStats2ed = ['A', 'Żyw', 'SB', 'TB', 'Mag', 'PO', 'PP'];

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: '', weight: 1 },
    ]);
    setFocusNewOption(true);
  };

  const updateOption = (optionId, patch) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, ...patch } : opt))
    );
  };

  const removeOption = (optionId) => {
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

    setFields((prev) => [
      ...prev,
      { label: '', source },
    ]);

    setMultiTables((prev) => ({
      ...prev,
      [source]: [],
    }));
  };

  const updateField = (index, patch) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, ...patch } : field))
    );
  };

  const renameFieldSource = (index, newSource) => {
    setFields((prev) => {
      const oldSource = prev[index]?.source;
      const next = prev.map((field, i) =>
        i === index ? { ...field, source: newSource } : field
      );

      if (!oldSource || oldSource === newSource) return next;

      setMultiTables((prevMulti) => {
        const cloned = { ...prevMulti };
        cloned[newSource] = [...(cloned[oldSource] || [])];
        delete cloned[oldSource];
        return cloned;
      });

      return next;
    });
  };

  const removeField = (index) => {
    const sourceToDelete = fields[index]?.source;

    setFields((prev) => prev.filter((_, i) => i !== index));

    if (sourceToDelete) {
      setMultiTables((prev) => {
        const cloned = { ...prev };
        delete cloned[sourceToDelete];
        return cloned;
      });
    }
  };

  const addOptionToMultiTable = (source) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: [
        ...(prev[source] || []),
        { id: crypto.randomUUID(), text: '', weight: 1 },
      ],
    }));
    setFocusNewMultiSource(source);
  };

  const updateMultiTableOption = (source, optionId, patch) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: (prev[source] || []).map((opt) =>
        opt.id === optionId ? { ...opt, ...patch } : opt
      ),
    }));
  };

  const removeMultiTableOption = (source, optionId) => {
    setMultiTables((prev) => ({
      ...prev,
      [source]: (prev[source] || []).filter((opt) => opt.id !== optionId),
    }));
  };

  const addNoteBlock = (blockType) => {
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

  const moveNoteBlock = (index, direction) => {
    const newBlocks = [...noteBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setNoteBlocks(newBlocks);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
      lastMultiInputRef.current[focusNewMultiSource].focus();
      setFocusNewMultiSource(null);
    }
  }, [multiTables, focusNewMultiSource]);

  const handleRollFromTable = (table, field, index) => {
    if (!table) return;

    // NAJPIERW obsługa zagnieżdżania tabel
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

    let sourceOptions = [];

    if (Array.isArray(table.options) && table.options.length > 0) {
      sourceOptions = table.options;
    } else if (table.subType === 'simple' && Array.isArray(table.variants)) {
      sourceOptions = table.variants.flatMap((variant) => variant.options || []);
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
      setSkills((prev) => prev.map((v, i) => (i === index ? rolledValue : v)));
    } else if (field === 'talents' && typeof index === 'number') {
      setTalents((prev) => prev.map((v, i) => (i === index ? rolledValue : v)));
    }

    setShowTablePicker(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const normalizedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    const finalTags =
      currentUser?.role === 'admin' && isBuiltIn
        ? Array.from(new Set([...normalizedTags, 'Wbudowane']))
        : normalizedTags.filter((tag) => tag !== 'Wbudowane');

    const baseItem = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      tags: finalTags,
      ownerId: initialData?.ownerId || currentUser?.id,
      ownerName: initialData?.ownerName || currentUser?.username,
      isBuiltIn: currentUser?.role === 'admin' ? isBuiltIn : false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    let item = null;

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
    isBuiltIn,
    setIsBuiltIn,

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