import { ArchiveItem, DiceArchive, RandomTable } from '../../../types';
import { Card, CardContent } from '../card';
import { Button } from '../button';
import {
  Check,
  Copy,
  CopyPlus,
  Download,
  Edit,
  FileText,
  Skull,
  Trash2,
  X,
} from 'lucide-react';
import { TablePreview } from './previews/TablePreview';
import { DicePreview } from './previews/DicePreview';
import { NotePreview } from './previews/NotePreview';
import { CharacterPreview } from './previews/CharacterPreview';

interface PreviewPanelProps {
  currentUser: any;
  previewItem: ArchiveItem | null;
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  handleClone: (item: ArchiveItem) => void;
  handleExport: (item: ArchiveItem) => void;
  handleRoll: (table: RandomTable) => void;
  handleDiceRoll?: (dice: DiceArchive) => void;
  handleQuickUpdateDice: (dice: DiceArchive) => Promise<void>;
  rollCount: number;
  setRollCount: (value: number) => void;
  activeVariants: Record<string, string[]>;
  toggleVariant: (tableId: string, variantId: string) => void;
  results: any[];
  setResults: (value: any[] | ((prev: any[]) => any[])) => void;
  lastRollCount: number;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (value: boolean) => void;
  copied: boolean;
  copyToClipboard: () => void;
}

export function PreviewPanel({
  currentUser,
  previewItem,
  onEdit,
  onDelete,
  handleClone,
  handleExport,
  handleRoll,
  handleDiceRoll,
  handleQuickUpdateDice,
  rollCount,
  setRollCount,
  activeVariants,
  toggleVariant,
  results,
  setResults,
  lastRollCount,
  isHistoryExpanded,
  setIsHistoryExpanded,
  copied,
  copyToClipboard,
}: PreviewPanelProps) {
  const renderPreview = () => {
    if (!previewItem) return null;

    if (previewItem.type === 'table') {
      return (
        <TablePreview
          previewItem={previewItem}
          handleRoll={handleRoll}
          rollCount={rollCount}
          setRollCount={setRollCount}
          activeVariants={activeVariants}
          toggleVariant={toggleVariant}
          results={results}
          lastRollCount={lastRollCount}
          isHistoryExpanded={isHistoryExpanded}
          setIsHistoryExpanded={setIsHistoryExpanded}
        />
      );
    }

    if (previewItem.type === 'dice') {
      return (
        <DicePreview
          previewItem={previewItem}
          handleDiceRoll={handleDiceRoll}
          handleQuickUpdateDice={handleQuickUpdateDice}
          rollCount={rollCount}
          setRollCount={setRollCount}
          results={results}
          lastRollCount={lastRollCount}
          isHistoryExpanded={isHistoryExpanded}
          setIsHistoryExpanded={setIsHistoryExpanded}
        />
      );
    }

    if (previewItem.type === 'note') {
      return <NotePreview previewItem={previewItem} />;
    }

    if (previewItem.type === 'character') {
      return <CharacterPreview previewItem={previewItem} />;
    }

    return null;
  };

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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleExport(previewItem)}
                    className="h-7 w-7 text-primary/40 hover:text-primary"
                    title="Eksportuj do JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>

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
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
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
              <p className="text-sm">Wybierz wpis z lewej, aby zobaczyć szczegóły lub wykonać rzut.</p>
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              {renderPreview()}

              {(previewItem.type === 'table' || previewItem.type === 'dice') && results.length === 0 && (
                <div className="py-12 text-center text-primary/30 italic">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p>Kliknij, aby wykonać rzut.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}