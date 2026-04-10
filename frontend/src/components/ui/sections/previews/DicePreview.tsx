import { useEffect, useRef, useState } from 'react';
import { DiceArchive } from '../../../../types';
import { Button } from '../../button';
import { Dice5 } from 'lucide-react';
import { ResultHistory } from '../ResultHistory';
import { ResultRenderer } from '../ResultRenderer';

interface DicePreviewProps {
  previewItem: DiceArchive;
  handleDiceRoll?: (dice: DiceArchive) => void;
  handleQuickUpdateDice: (dice: DiceArchive) => Promise<void>;
  rollCount: number;
  setRollCount: (value: number) => void;
  results: any[];
  lastRollCount: number;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (value: boolean) => void;
}

export function DicePreview({
  previewItem,
  handleDiceRoll,
  handleQuickUpdateDice,
  rollCount,
  setRollCount,
  results,
  lastRollCount,
  isHistoryExpanded,
  setIsHistoryExpanded,
}: DicePreviewProps) {
  const [isEditingDiceFormula, setIsEditingDiceFormula] = useState(false);
  const [draftDiceFormula, setDraftDiceFormula] = useState('');
  const diceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftDiceFormula(previewItem.formula || '');
    setIsEditingDiceFormula(false);
  }, [previewItem]);

  useEffect(() => {
    if (isEditingDiceFormula && diceInputRef.current) {
      diceInputRef.current.focus();
      diceInputRef.current.select();
    }
  }, [isEditingDiceFormula]);

  const saveInlineDiceFormula = async () => {
    const trimmed = draftDiceFormula.trim();
    const original = previewItem.formula || '';

    if (!trimmed) {
      setDraftDiceFormula(original);
      setIsEditingDiceFormula(false);
      return;
    }

    if (trimmed === original) {
      setIsEditingDiceFormula(false);
      return;
    }

    const updatedDice: DiceArchive = {
      ...previewItem,
      formula: trimmed,
    };

    try {
      await handleQuickUpdateDice(updatedDice);
      setIsEditingDiceFormula(false);
      handleDiceRoll?.(updatedDice);
    } catch {
      setDraftDiceFormula(original);
      setIsEditingDiceFormula(false);
    }
  };

  const cancelInlineDiceEdit = () => {
    setDraftDiceFormula(previewItem.formula || '');
    setIsEditingDiceFormula(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-4 bg-background/50 p-3 rounded border border-primary/10">
          <label className="text-[10px] font-black uppercase text-primary/40 whitespace-nowrap">
            Formuła:
          </label>

          {isEditingDiceFormula ? (
            <input
              ref={diceInputRef}
              type="text"
              value={draftDiceFormula}
              onChange={(e) => setDraftDiceFormula(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void saveInlineDiceFormula();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelInlineDiceEdit();
                }
              }}
              onBlur={() => {
                void saveInlineDiceFormula();
              }}
              className="bg-transparent border-b border-primary/30 text-lg font-bold text-primary font-mono focus:outline-none focus:border-primary min-w-[140px]"
              placeholder="np. 1d10+20"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingDiceFormula(true)}
              className="font-mono text-lg font-bold text-primary hover:text-primary/80 border-b border-dashed border-primary/20 hover:border-primary/60 transition-colors"
              title="Kliknij, aby edytować formułę"
            >
              {previewItem.formula}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 bg-background/50 p-3 rounded border border-primary/10 max-w-[150px]">
          <label className="text-[10px] font-black uppercase text-primary/40 whitespace-nowrap">
            Rzuty:
          </label>
          <input
            type="number"
            // min="1"
            // max="20"
            value={rollCount}
            onChange={(e) =>
              setRollCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))
            }
            onClick={(e) => (e.target as HTMLInputElement).select()}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent border-none text-right font-bold text-primary focus:ring-0 text-base"
          />
        </div>

        <Button
          onClick={() => handleDiceRoll?.(previewItem)}
          className="wfrp-button h-[46px] px-6"
        >
          <Dice5 className="w-4 h-4 mr-2" /> Rzuć kośćmi
        </Button>
      </div>

      {previewItem.description && (
        <div className="bg-background/30 p-4 rounded border border-primary/10">
          <p className="text-sm italic text-primary/70">{previewItem.description}</p>
        </div>
      )}

      <ResultHistory
        results={results}
        lastRollCount={lastRollCount}
        isHistoryExpanded={isHistoryExpanded}
        setIsHistoryExpanded={setIsHistoryExpanded}
        ResultRenderer={ResultRenderer}
      />
    </div>
  );
}