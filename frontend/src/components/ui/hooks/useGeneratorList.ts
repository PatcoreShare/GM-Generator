import { useState } from 'react';
import { toast } from 'sonner';
import { ArchiveItem, ImportExportData, RandomTable, User, DiceArchive } from '../../../types';
import { performRoll, formatResultForClipboard } from '../utils/rollTable';
import { rollDice } from '../utils/rollDice';

interface UseGeneratorListProps {
  generators: ArchiveItem[];
  allTables: RandomTable[];
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  currentUser: User;
}

export function useGeneratorList({
  generators,
  allTables,
  onEdit,
  onDelete,
  currentUser,
}: UseGeneratorListProps) {
  const [results, setResults] = useState<any[]>([]);
  const [rollCount, setRollCount] = useState(1);
  const [lastRollCount, setLastRollCount] = useState(0);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeVariants, setActiveVariants] = useState<Record<string, string[]>>({});
  const [previewItem, setPreviewItem] = useState<ArchiveItem | null>(null);

  const handleRoll = (table: RandomTable) => {
    const newResults = [];
    const selectedVariants = activeVariants[table.id] || [];

    for (let i = 0; i < rollCount; i++) {
      newResults.push(
        performRoll({
          table,
          allTables,
          activeVariants,
          selectedVariantIds: selectedVariants,
        })
      );
    }

    setResults((prev) => [...newResults, ...prev].slice(0, 50));
    setLastRollCount(rollCount);
    setIsHistoryExpanded(false);
    setPreviewItem(table);
  };

  const handleDiceRoll = (diceItem: DiceArchive) => {
    try {
      const newResults = [];

      for (let i = 0; i < rollCount; i++) {
        const result = rollDice(diceItem.formula);
        newResults.push({
          sourceId: diceItem.id,
          type: 'dice',
          name: diceItem.name,
          formula: diceItem.formula,
          description: diceItem.description || '',
          total: result.total,
          rolls: result.rolls,
          modifier: result.modifier,
        });
      }

      setResults((prev) => [...newResults, ...prev].slice(0, 50));
      setLastRollCount(rollCount);
      setIsHistoryExpanded(false);
      setPreviewItem(diceItem);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Błąd rzutu kośćmi');
    }
  };

  const handleQuickUpdateDice = async (updatedDice: DiceArchive) => {
    try {
      const response = await fetch('/api/generators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDice),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zapisać zmian formuły');
      }

      const saved = await response.json();

      setPreviewItem(saved);

      setResults((prev) =>
        prev.map((result) =>
          result?.type === 'dice' && result?.sourceId === updatedDice.id
            ? { ...result, formula: saved.formula, name: saved.name, description: saved.description || '' }
            : result
        )
      );

      toast.success('Zapisano nową formułę');
    } catch (error) {
      toast.error('Nie udało się zapisać formuły');
      throw error;
    }
  };

  const handleClone = (item: ArchiveItem) => {
    const cloned = {
      ...item,
      id: crypto.randomUUID(),
      ownerId: currentUser.id,
      ownerName: currentUser.username,
      tags: item.tags || [],
      createdAt: new Date().toISOString(),
    };

    onEdit(cloned as ArchiveItem);
    toast.info('Skopiowano do Twojego archiwum. Możesz teraz edytować.');
  };

  const handleExport = (item: ArchiveItem) => {
    const data: ImportExportData = { generators: [item] };

    const safeName = item.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName || 'generator'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Wyeksportowano: ${item.name}`);
  };

  const copyToClipboard = () => {
    const text = results.map((res) => formatResultForClipboard(res)).join('\n---\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Skopiowano wyniki do schowka');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVariant = (tableId: string, variantId: string) => {
    const current = activeVariants[tableId] || [];

    if (current.includes(variantId)) {
      setActiveVariants({
        ...activeVariants,
        [tableId]: current.filter((id) => id !== variantId),
      });
    } else {
      setActiveVariants({
        ...activeVariants,
        [tableId]: [...current, variantId],
      });
    }
  };

  const handlePreview = (item: ArchiveItem) => {
    setPreviewItem(item);

    if (item.type === 'table') {
      handleRoll(item);
      return;
    }

    if (item.type === 'dice') {
      handleDiceRoll(item);
      return;
    }

    if (item.type === 'note') {
      setResults((prev) =>
        [
          {
            type: 'note',
            name: item.name,
            content: item.blocks[0]?.content || '',
          },
          ...prev,
        ].slice(0, 50)
      );
      setLastRollCount(1);
      return;
    }

    if (item.type === 'character') {
      setResults((prev) =>
        [
          {
            type: 'character',
            name: item.name,
            race: item.race,
            profession: item.profession,
          },
          ...prev,
        ].slice(0, 50)
      );
      setLastRollCount(1);
    }
  };

  return {
    generators,
    allTables,
    onEdit,
    onDelete,
    currentUser,

    results,
    setResults,
    rollCount,
    setRollCount,
    lastRollCount,
    setLastRollCount,
    isHistoryExpanded,
    setIsHistoryExpanded,
    copied,
    setCopied,
    activeVariants,
    setActiveVariants,
    previewItem,
    setPreviewItem,

    handleRoll,
    handleDiceRoll,
    handleQuickUpdateDice,
    handleClone,
    handleExport,
    copyToClipboard,
    toggleVariant,
    handlePreview,
  };
}