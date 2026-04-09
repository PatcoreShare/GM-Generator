import { useState } from 'react';
import { toast } from 'sonner';
import { ArchiveItem, RandomTable, User } from '../../../types';
import { performRoll, formatResultForClipboard } from '../utils/rollTable';

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

  const handleClone = (item: ArchiveItem) => {
    const cloned = {
      ...item,
      id: crypto.randomUUID(),
      ownerId: currentUser.id,
      ownerName: currentUser.username,
      isBuiltIn: false,
      tags: item.tags?.filter((t) => t !== 'Wbudowane') || [],
      createdAt: new Date().toISOString(),
    };

    onEdit(cloned as ArchiveItem);
    toast.info('Skopiowano do Twojego archiwum. Możesz teraz edytować.');
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

    if (item.type === 'note') {
      setResults((prev) => [
        {
          type: 'note',
          name: item.name,
          content: item.blocks[0]?.content || '',
        },
        ...prev,
      ].slice(0, 50));
      setLastRollCount(1);
      return;
    }

    if (item.type === 'character') {
      setResults((prev) => [
        {
          type: 'character',
          name: item.name,
          race: item.race,
          profession: item.profession,
        },
        ...prev,
      ].slice(0, 50));
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
    handleClone,
    copyToClipboard,
    toggleVariant,
    handlePreview,
  };
}