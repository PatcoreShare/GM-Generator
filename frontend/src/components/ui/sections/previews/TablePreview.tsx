import { RandomTable } from '../../../../types';
import { Button } from '../../button';
import { Dice5 } from 'lucide-react';
import { ResultHistory } from '../ResultHistory';
import { ResultRenderer } from '../ResultRenderer';

interface TablePreviewProps {
  previewItem: RandomTable;
  handleRoll: (table: RandomTable) => void;
  rollCount: number;
  setRollCount: (value: number) => void;
  activeVariants: Record<string, string[]>;
  toggleVariant: (tableId: string, variantId: string) => void;
  results: any[];
  lastRollCount: number;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (value: boolean) => void;
}

export function TablePreview({
  previewItem,
  handleRoll,
  rollCount,
  setRollCount,
  activeVariants,
  toggleVariant,
  results,
  lastRollCount,
  isHistoryExpanded,
  setIsHistoryExpanded,
}: TablePreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-4 bg-background/50 p-3 rounded border border-primary/10 max-w-[150px]">
          <label className="text-[10px] font-black uppercase text-primary/40 whitespace-nowrap">
            Rzuty:
          </label>
          <input
            type="number"
            min="0"
            value={rollCount}
            onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setRollCount(Number.isNaN(next) ? 1 : Math.max(1, next));
            }}
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

        <Button onClick={() => handleRoll(previewItem)} className="wfrp-button h-[46px] px-6">
          <Dice5 className="w-4 h-4 mr-2" /> Losuj
        </Button>
      </div>

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