import { Button } from '../button';
import { Dice5 } from 'lucide-react';
import { ResultRenderer } from './ResultRenderer';

interface ResultHistoryProps {
  results: any[];
  lastRollCount: number;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (value: boolean) => void;
}

export function ResultHistory({
  results,
  lastRollCount,
  isHistoryExpanded,
  setIsHistoryExpanded,
}: ResultHistoryProps) {
  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-primary/30 italic">
        <Dice5 className="w-12 h-12 mx-auto mb-4 opacity-10" />
        <p>Kliknij w kafel tabeli, aby wylosować wyniki.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {results.slice(0, lastRollCount).map((res, i) => (
          <div
            key={`current-${i}`}
            className="p-5 rounded border-2 border-primary/40 bg-primary/10 font-serif italic text-lg font-bold text-primary shadow-md animate-in slide-in-from-right-4 duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-sans not-italic opacity-30 uppercase tracking-widest">
                Wynik #{results.length - i}
              </span>
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
            {isHistoryExpanded
              ? 'Ukryj poprzednie rzuty'
              : `Pokaż poprzednie rzuty (${results.length - lastRollCount})`}
          </Button>

          {isHistoryExpanded && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {results.slice(lastRollCount).map((res, i) => (
                <div
                  key={`history-${i}`}
                  className="p-4 rounded border border-primary/10 bg-background/30 font-serif italic text-base text-primary/60"
                >
                  <span className="text-[10px] font-sans not-italic mr-4 opacity-20">
                    #{results.length - lastRollCount - i}
                  </span>
                  <ResultRenderer data={res} isNested={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}